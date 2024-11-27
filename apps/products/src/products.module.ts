import { Module } from '@nestjs/common';
import { ProductsController } from './products.controller';
import { ProductsService } from './products.service';
import { ProductsFacade } from './products.facade';
import { PrismaService } from '@app/common';
import { ProductsRepository } from './products.repository';
import { CategoriesModule } from 'apps/categories/src/categories.module';

@Module({
  imports: [CategoriesModule],
  controllers: [ProductsController],
  providers: [
    PrismaService,
    ProductsRepository,
    ProductsService,
    ProductsFacade,
  ],
  exports: [ProductsFacade, ProductsService],
})
export class ProductsModule {}
