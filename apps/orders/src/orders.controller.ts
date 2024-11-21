import { Body, Controller, Get, Post, UsePipes } from '@nestjs/common';
import { PrismaService, Sequencer } from '@app/common';
import { NewOrderDTO, NewOrderDTOSchema } from './dto/newOrder';
import { ZodValidationPipe } from '@app/common/pipes/ZodValidation';
import { SqsMessageHandler } from '@ssut/nestjs-sqs';

@Controller()
export class OrdersController {
  constructor(private readonly sequencer: Sequencer) {}

  // @UsePipes(new ZodValidationPipe(NewOrderDTOSchema))
  // async handleNewOrders(@Body() newOrderDTO: NewOrderDTO) {
  //   return {
  //     isSuccess: true,
  //     newOrderDTO,
  //   };
  // }

  @SqsMessageHandler('orders', false)
  async handleNewOrders(sqsMessage: any) {
    console.log('sqs message was', sqsMessage);
    return true;
  }

  @Get()
  async getHello() {
    const orderId = await this.sequencer.getSequenceNumber({
      code: 'ORDERS',
      prefix: 'ORD-',
      padding: 6,
    });

    return {
      isSuccess: true,
      orderId: orderId,
    };
  }
}
