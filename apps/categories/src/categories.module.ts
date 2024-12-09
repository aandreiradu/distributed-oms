import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import { CategoriesService } from './categories.service';
import { LockResource, PrismaService } from '@app/common';
import { CategoriesRepository } from './categories.repository';
import { RedisModule } from '@app/common/redis/redis.module';
import { RedisService } from '@app/common/redis/redis.service';
import { LockDistriburedResource } from '@app/common/utils/lockDS';

@Module({
  imports: [RedisModule],
  controllers: [CategoriesController],
  providers: [
    CategoriesService,
    PrismaService,
    CategoriesRepository,
<<<<<<< Updated upstream
    LockDistriburedResource,
  ],
  exports: [CategoriesService],
=======
    LockResource,
  ],
  exports: [CategoriesService, CategoriesRepository],
>>>>>>> Stashed changes
})
export class CategoriesModule {}
