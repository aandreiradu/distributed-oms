import { NestFactory } from '@nestjs/core';
import { ProductsModule } from './products.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(ProductsModule);
}
bootstrap();
