import { Inject, Logger, OnModuleDestroy } from '@nestjs/common';
import Redis from 'ioredis';

export class RedisService implements OnModuleDestroy {
  private readonly logger: Logger = new Logger(RedisService.name);
  constructor(private readonly client: Redis) {}

  getClient() {
    return this.client;
  }
  async onModuleDestroy() {
    this.client.disconnect();
  }

  async set(key: string, value: string, expirationSeconds: number) {
    return await this.client.set(key, value, 'EX', expirationSeconds);
  }

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }
}
