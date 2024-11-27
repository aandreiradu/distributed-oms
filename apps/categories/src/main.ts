import { NestFactory } from '@nestjs/core';
import { CategoriesModule } from './categories.module';

async function bootstrap() {
  await NestFactory.createApplicationContext(CategoriesModule);
}
bootstrap();
