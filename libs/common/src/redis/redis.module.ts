import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Redis from 'ioredis';
import { RedisService } from './redis.service';

@Global()
@Module({
  providers: [
    {
      provide: 'REDIS_CLIENT',
      useFactory: async (configSerice: ConfigService) => {
        const redis = new Redis({
          host: configSerice.getOrThrow<string>('REDIS_HOST'),
          port: +configSerice.getOrThrow<string>('REDIS_PORT'),
        });

        redis.on('connect', () =>
          console.info('Connected successfully to redis'),
        );
        redis.on('error', (error) =>
          console.error('Failed to connect to redirs', error),
        );

        return redis;
      },
      inject: [ConfigService],
    },
    RedisService,
  ],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisModule {}
