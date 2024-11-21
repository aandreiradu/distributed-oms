import { Body, Controller, Get, Post } from '@nestjs/common';
import { GatewayService } from './gateway.service';

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
  async sendOrder(@Body() order: any) {
    return this.gatewayService.forwardToOrders(order);
  }
}
