import { Controller, Get, Logger } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
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
  @ApiOperation({ summary: "Statut de l'API" })
  async check() {
    let dbStatus = 'ok';
    try {
      await this.prisma.$queryRaw`SELECT 1`;
    } catch (err) {
      dbStatus = 'error';
      this.logger.error('Health check DB échoué', err instanceof Error ? err.stack : undefined);
    }

    let redisStatus: string = this.redis ? 'unknown' : 'disabled';
    if (this.redis) {
      try {
        await this.redis.ping();
        redisStatus = 'ok';
      } catch (err) {
        redisStatus = 'error';
        this.logger.error('Health check Redis échoué', err instanceof Error ? err.stack : undefined);
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
