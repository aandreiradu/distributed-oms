import { PrismaService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';
import AWS from 'aws-sdk';

@Injectable()
export class OrdersConsumer {
  private readonly logger: Logger = new Logger(OrdersConsumer.name);
  constructor(private readonly prismaService: PrismaService) {}

  @SqsMessageHandler('orders', false)
  public async handleMessages(message: AWS.SQS.Message) {
    console.log('asdfa', message);

    try {
    } catch (error) {}
    return true;
  }
}
