import { Injectable, Logger } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CategoriesService } from 'apps/categories/src/categories.service';
import { PrismaClient } from '@prisma/client';
import { CreateProductDTO } from './dto/create-product';
import { PrismaService } from '@app/common';

@Injectable()
export class ProductsFacade {
  private readonly logger: Logger = new Logger(ProductsFacade.name);

  constructor(
    private readonly productsService: ProductsService,
    private readonly categoryService: CategoriesService,
    private readonly prisma: PrismaService,
  ) {}

  async createProduct(createProductDTO: CreateProductDTO) {
    return await this.prisma.$transaction(async (tx) => {
      /* Task 1 = Validate categories */
      const categories = await this.categoryService.validateCategories(
        createProductDTO.categories,
        tx,
      );

      /* Task 2 = Create the product */
      const product = await this.productsService.createProduct(
        createProductDTO,
        tx,
      );

      /* Task 3 = Link product to categories */
      const categoryIds = categories.map((category) => category.id);
      await this.productsService.linkProductToCategories(
        product.id,
        categoryIds,
        tx,
      );

      return product;
    });
  }
}
