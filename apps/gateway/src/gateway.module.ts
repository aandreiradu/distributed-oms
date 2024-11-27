import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { SQSService } from '@app/common/aws/sqs.service';
import { CidMiddleware } from '@app/common/middlewares/cid';
import { CategoriesModule } from 'apps/categories/src/categories.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    CategoriesModule,
  ],
  providers: [GatewayService, SQSService],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CidMiddleware).forRoutes('*');
  }
}
