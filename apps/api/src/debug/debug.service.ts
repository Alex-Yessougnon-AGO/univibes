import {
  Injectable,
  Logger,
  ForbiddenException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../prisma/prisma.service';
import type { NestExpressApplication } from '@nestjs/platform-express';

// Buffer circulaire pour stocker les logs en mémoire
const MAX_LOG_ENTRIES = 1000;

export interface DebugLogEntry {
  timestamp: string;
  level: 'log' | 'warn' | 'error' | 'debug' | 'verbose';
  message: string;
  context?: string;
  trace?: string;
  meta?: Record<string, unknown>;
}

@Injectable()
export class DebugService {
  private readonly logger = new Logger(DebugService.name);
  private logBuffer: DebugLogEntry[] = [];
  private errorBuffer: DebugLogEntry[] = [];
  private appRef: NestExpressApplication | null = null;

  constructor(
    private readonly configService: ConfigService,
    private readonly prisma: PrismaService,
  ) {}

  setAppRef(app: NestExpressApplication) {
    this.appRef = app;
  }

  /** Vérifie qu'on est en mode développement */
  checkDevMode(): void {
    const nodeEnv = this.configService.get<string>('NODE_ENV', 'development');
    if (nodeEnv === 'production') {
      throw new ForbiddenException({
        code: 'DEBUG_DISABLED',
        message: 'Le mode debug est d\u00e9sactiv\u00e9 en production.',
      });
    }
  }

  /** Ajoute une entrée de log au buffer */
  addLog(entry: DebugLogEntry): void {
    this.logBuffer.push(entry);
    if (this.logBuffer.length > MAX_LOG_ENTRIES) {
      this.logBuffer.shift();
    }

    if (entry.level === 'error') {
      this.errorBuffer.push(entry);
      if (this.errorBuffer.length > 200) {
        this.errorBuffer.shift();
      }
    }
  }

  /** Retourne les logs récents */
  getLogs() {
    const limit = 200;
    return {
      entries: this.logBuffer.slice(-limit),
      total: this.logBuffer.length,
      limit,
    };
  }

  /** Retourne les erreurs récentes */
  getErrors() {
    return {
      entries: this.errorBuffer.slice(-50),
      total: this.errorBuffer.length,
    };
  }

  /** Configuration avec valeurs sensibles masquées */
  getSanitizedConfig() {
    const sensitiveKeys = [
      'PASSWORD', 'SECRET', 'TOKEN', 'KEY', 'DSN', 'PRIVATE',
    ];
    const raw = process.env;
    const sanitized: Record<string, string> = {};

    for (const [key, value] of Object.entries(raw)) {
      if (!value) continue;
      const isSensitive = sensitiveKeys.some((sk) =>
        key.toUpperCase().includes(sk),
      );
      sanitized[key] = isSensitive
        ? `${value.substring(0, 4)}...${value.substring(value.length - 4)}`
        : value;
    }

    return {
      environment: this.configService.get<string>('NODE_ENV', 'development'),
      nodeVersion: process.version,
      platform: process.platform,
      memory: process.memoryUsage(),
      uptime: process.uptime(),
      pid: process.pid,
      vars: sanitized,
    };
  }

  /** Santé détaillée avec timing */
  async getDetailedHealth() {
    const start = Date.now();

    // Test DB
    let dbStatus = 'ok';
    let dbLatency = 0;
    try {
      const dbStart = Date.now();
      await this.prisma.$queryRaw`SELECT 1`;
      dbLatency = Date.now() - dbStart;
    } catch (err) {
      dbStatus = 'error';
      this.logger.error('Debug health check DB failed', err instanceof Error ? err.stack : undefined);
    }

    // Comptes DB
    let dbCounts = {};
    try {
      const [users, events, orders, organizers, payments] = await Promise.all([
        this.prisma.user.count(),
        this.prisma.event.count(),
        this.prisma.order.count(),
        this.prisma.organizer.count(),
        this.prisma.payment.count(),
      ]);
      dbCounts = { users, events, orders, organizers, payments };
    } catch {
      // Silently fail
    }

    const totalLatency = Date.now() - start;

    return {
      status: dbStatus === 'ok' ? 'healthy' : 'degraded',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      memory: {
        heapUsed: Math.round(process.memoryUsage().heapUsed / 1024 / 1024) + 'MB',
        heapTotal: Math.round(process.memoryUsage().heapTotal / 1024 / 1024) + 'MB',
        rss: Math.round(process.memoryUsage().rss / 1024 / 1024) + 'MB',
      },
      latency: {
        total: totalLatency + 'ms',
        database: dbLatency + 'ms',
      },
      database: {
        status: dbStatus,
        counts: dbCounts,
      },
    };
  }

  /** Logs d'audit récents */
  async getAuditLogs() {
    const logs = await this.prisma.auditLog.findMany({
      orderBy: { createdAt: 'desc' },
      take: 100,
      include: {
        actor: {
          select: { email: true, profile: { select: { fullname: true } } },
        },
      },
    });

    return {
      entries: logs,
      total: await this.prisma.auditLog.count(),
    };
  }

  /** Routes enregistrées (introspection Express - peut ne pas lister toutes les routes) */
  getRoutes() {
    if (!this.appRef) {
      return { message: 'Application reference not available yet', routes: [] };
    }

    try {
      const server = this.appRef.getHttpServer() as any;
      const routes: { method: string; path: string }[] = [];
      if (server && server._router && server._router.stack) {
        for (const layer of server._router.stack) {
          if (layer.route) {
            const methods = Object.keys(layer.route.methods)
              .map((m: string) => m.toUpperCase());
            for (const method of methods) {
              routes.push({
                method,
                path: layer.route.path,
              });
            }
          }
        }
      }
      return { total: routes.length, routes: routes.sort((a, b) => a.path.localeCompare(b.path)) };
    } catch {
      return { message: 'Cannot enumerate routes', routes: [] };
    }
  }

  /** Vide le buffer */
  clear() {
    this.logBuffer = [];
    this.errorBuffer = [];
    this.logger.log('Debug buffer cleared');
  }
}
