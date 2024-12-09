import { PrismaService } from '@app/common';
import { Injectable } from '@nestjs/common';
import { NewOrderDTO } from './dto/newOrder';

@Injectable()
export class OrdersService {
  constructor(private readonly prismaService: PrismaService) {}
  getHello(): string {
    return 'Hello World!';
  }

  async createOrder(order: NewOrderDTO) {
    try {
      await this.prismaService.order.create({
        data: {
          ...order,
        },
      });
    } catch (error) {}
  }
}
