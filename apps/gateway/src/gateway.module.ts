import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { GatewayController } from './gateway.controller';
import { GatewayService } from './gateway.service';
import { ConfigModule } from '@nestjs/config';
import { SQSService } from '@app/common/aws/sqs.service';
import { CidMiddleware } from '@app/common/middlewares/cid';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
  ],
  controllers: [GatewayController],
  providers: [GatewayService, SQSService],
})
export class GatewayModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(CidMiddleware).forRoutes('*');
  }
}
