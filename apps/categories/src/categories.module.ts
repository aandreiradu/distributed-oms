import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { PrismaService } from '@app/common';
import { CategoriesRepository } from './categories.repository';
import { RedisModule } from '@app/common/redis/redis.module';
import { LockDistriburedResource } from '@app/common/utils/lockDS';
import { RedisService } from '@app/common/redis/redis.service';

@Module({
  imports: [RedisModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    PrismaService,
    CategoriesRepository,
    RedisService,
    LockDistriburedResource,
  ],
  exports: [CategoriesService],
})
export class CategoriesModule {}
