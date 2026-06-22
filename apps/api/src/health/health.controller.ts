import { Controller, Get, Logger } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import Redis from 'ioredis';
import { PrismaService } from '../prisma/prisma.service';
import { Public } from '../common/decorators/public.decorator';

@ApiTags('health')
@Controller('health')
export class HealthController {
  private readonly logger = new Logger(HealthController.name);
  private redis: Redis | null = null;

  constructor(private readonly prisma: PrismaService) {
    if (process.env.REDIS_URL) {
      this.redis = new Redis(process.env.REDIS_URL, {
        lazyConnect: true,
        maxRetriesPerRequest: 1,
        connectTimeout: 3000,
      });
    }
  }

  @Get()
  @Public()
  @ApiOperation({
    summary: "Statut de l'API",
    description: "V\u00e9rifie l'\u00e9tat de la base de donn\u00e9es PostgreSQL et de Redis. Retourne le statut global (ok/degraded) avec les d\u00e9tails par service.",
  })
  @ApiResponse({
    status: 200,
    description: "Statut de l'API",
    schema: {
      type: 'object',
      properties: {
        status: { type: 'string', example: 'ok' },
        version: { type: 'string', example: '2.0.0' },
        timestamp: { type: 'string', format: 'date-time' },
        services: {
          type: 'object',
          properties: {
            database: { type: 'string', example: 'ok' },
            redis: { type: 'string', example: 'disabled' },
          },
        },
      },
    },
  })
  async check() {
    let dbStatus = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      dbStatus = 'error';
      this.logger.error('Health check DB \u00e9chou\u00e9', err instanceof Error ? err.stack : undefined);
    }

    let redisStatus: string = this.redis ? 'unknown' : 'disabled';
    if (this.redis) {
      try {
        await this.redis.ping();
        redisStatus = 'ok';
      } catch (err) {
        redisStatus = 'error';
        this.logger.error('Health check Redis \u00e9chou\u00e9', err instanceof Error ? err.stack : undefined);
      }
    }

    const allOk = dbStatus === 'ok' && (redisStatus === 'ok' || redisStatus === 'disabled');

    return {
      status: allOk ? 'ok' : 'degraded',
      version: '2.0.0',
      timestamp: new Date().toISOString(),
      services: {
        database: dbStatus,
        redis: redisStatus,
      },
    };
  }
}
