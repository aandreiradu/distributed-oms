import { Controller, Get } from '@nestjs/common';
import { Sequencer } from '@app/common';
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
