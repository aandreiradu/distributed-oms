import { Redis } from 'ioredis';
import { RedisService } from '../redis/redis.service';

export class LockDistriburedResource {
  private redisClient: Redis;
  constructor(private readonly redisService: RedisService) {}
  async lock<T>(key: string, func: () => Promise<T>, ttl = 10000) {
    const lockKey = `lock:${key}`;

    const acquired = await this.redisService.set(lockKey, 'locked', ttl);
    console.log('acquired', acquired);

    if (!acquired) {
      throw new Error(`Resource ${key} is already locked`);
    }

    try {
      await func();
    } finally {
      setTimeout(async () => {
        await this.redisClient.del(key);
      }, 5000);
    }
  }
}
