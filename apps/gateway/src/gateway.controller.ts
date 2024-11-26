import { Body, Controller, Get, Post, Req } from '@nestjs/common';
import { GatewayService } from './gateway.service';
import { DOMSRequest } from '@app/common/types/request';

/* 
TODO: 
The API Gateway forwards order creation requests synchronously to the Orders Service.
The Orders Service processes the order and sends events (e.g., OrderCreated) to an SQS queue for asynchronous processing.
A Worker Service (could be part of the Orders Service or another dedicated service) listens to the SQS queue and processes the event.
*/
@Controller()
export class GatewayController {
  constructor(private readonly gatewayService: GatewayService) {}

  @Post()
  async sendOrder(@Req() req: DOMSRequest, @Body() order: any) {
    const correlationId = req.headers['X-DOMS-CorrelationId'];
    await this.gatewayService.forwardToOrders(order, correlationId);

    return {
      isSuccess: true,
      message: 'Order placed successfully',
    };
  }
}
