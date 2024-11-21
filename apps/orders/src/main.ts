import { NestFactory } from '@nestjs/core';
import { OrdersModule } from './orders.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(OrdersModule);
}
bootstrap();
