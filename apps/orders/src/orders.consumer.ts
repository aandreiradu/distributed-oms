import { Injectable } from '@nestjs/common';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';

@Injectable()
export class OrdersConsumer {
  @SqsMessageHandler('orders', false)
  public async handleMessages(message: AWS.SQS.Message) {
    console.log('orders message is', message);
    return true;
  }
}
