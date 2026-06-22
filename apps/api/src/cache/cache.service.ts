import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';

@Injectable()
export class CacheService implements OnModuleDestroy {
  private readonly logger = new Logger(CacheService.name);
  private client: Redis | null = null;
  private available = false;
  private readonly ttl = 60;

  constructor(configService: ConfigService) {
    const redisUrl = configService.get<string>('REDIS_URL');
    if (redisUrl) {
      this.client = new Redis(redisUrl, {
        maxRetriesPerRequest: 3,
        retryStrategy(times) {
          if (times > 3) return null;
          return Math.min(times * 200, 2000);
        },
        lazyConnect: true,
      });

      this.client.on('error', (err) => {
        this.logger.warn(`Redis connection error: ${err.message}`);
      });

      this.client.on('ready', () => {
        this.available = true;
      });

      this.client.connect().catch((err) => {
        this.logger.warn(`Redis unavailable — caching disabled: ${err.message}`);
        this.available = false;
      });
    } else {
      this.logger.log('REDIS_URL not set — cache disabled');
    }
  }

  async get<T>(key: string): Promise<T | null> {
    if (!this.available || !this.client) return null;
    try {
      const raw = await this.client.get(key);
      if (!raw) return null;
      return JSON.parse(raw) as T;
    } catch {
      return null;
    }
  }

  async set(key: string, value: unknown, ttlSeconds?: number): Promise<void> {
    if (!this.available || !this.client) return;
    try {
      const ttl = ttlSeconds ?? this.ttl;
      const serialized = JSON.stringify(value);
      await this.client.setex(key, ttl, serialized);
    } catch (err) {
      this.logger.warn(`Cache set error for key "${key}": ${(err as Error).message}`);
    }
  }

  async del(key: string): Promise<void> {
    if (!this.available || !this.client) return;
    try {
      await this.client.del(key);
    } catch (err) {
      this.logger.warn(`Cache del error for key "${key}": ${(err as Error).message}`);
    }
  }

  async delPattern(pattern: string): Promise<void> {
    if (!this.available || !this.client) return;
    try {
      const stream = this.client.scanStream({ match: pattern, count: 100 });
      for await (const keys of stream) {
        if (keys.length > 0) {
          await this.client.del(...keys);
        }
      }
    } catch (err) {
      this.logger.warn(`Cache delPattern error for pattern "${pattern}": ${(err as Error).message}`);
    }
  }

  onModuleDestroy() {
    if (this.client) {
      this.client.disconnect();
    }
  }
}
