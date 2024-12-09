import { Inject, Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis, { Command } from 'ioredis';

@Injectable()
export class RedisService implements OnModuleDestroy {
  constructor(@Inject('REDIS_CLIENT') private readonly client: Redis) {}
  async onModuleDestroy() {
    this.client.disconnect();
  }

  async set(key: string, value: string, expirationSeconds: number) {
    const lockKey = `lock:${key}`;

    return await this.client.set(
      lockKey,
      value,
      ...(['NX', 'EX', expirationSeconds] as any[]),
    );
  }

  async get(key: string): Promise<string | null> {
    const lockKey = `lock:${key}`;
    return await this.client.get(lockKey);
  }

  async delete(key: string): Promise<number> {
    const lockKey = `lock:${key}`;
    return await this.client.del(lockKey);
  }
}
