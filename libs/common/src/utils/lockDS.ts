import { Redis } from 'ioredis';
import { RedisService } from '../redis/redis.service';
import { Injectable } from '@nestjs/common';
import { ResourceLockException } from '../errors/ResourceLock.error';

@Injectable()
export class LockDistriburedResource {
  private redisClient: Redis;
  constructor(private readonly redisService: RedisService) {}
  async lock<T>(key: string, func: () => Promise<T>, ttl = 10000) {
    const acquired = await this.redisService.set(key, 'locked', 3600);
    console.log('acquired', acquired);

    if (!acquired) {
      throw new ResourceLockException(`Resource ${key} is already locked`);
    }

    try {
      await func();
    } finally {
      await this.redisService.delete(key);
    }
  }
}
