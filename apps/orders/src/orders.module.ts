import { Module } from '@nestjs/common';
import { OrdersController } from './orders.controller';
import { OrdersService } from './orders.service';
import { PrismaModule, Sequencer } from '@app/common';
import { SqsModule } from '@ssut/nestjs-sqs';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
    }),
    PrismaModule,
    SqsModule.registerAsync({
      useFactory: async (configService: ConfigService) => {
        return {
          consumers: [
            {
              name: 'orders',
              attributeNames: ['All'],
              queueUrl: configService.get('AWS_SQS_ORDERS_QUEUE_URL'),
              batchSize: 1,
              pollingWaitTimeMs: 1000,
              waitTimeSeconds: 20,
              visibilityTimeout: 120,
            },
          ],
          producers: [],
        };
      },
      inject: [ConfigService],
    }),
  ],
  controllers: [OrdersController],
  providers: [OrdersService, Sequencer],
})
export class OrdersModule {}
