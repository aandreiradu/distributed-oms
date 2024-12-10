import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product';
import { Product } from '@prisma/client';
import { ProductsRepository } from './products.repository';
import { PrismaTransactionalClient } from '@app/common/types/prisma';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

@Injectable()
export class ProductsService {
  private readonly logger: Logger = new Logger(ProductsService.name);
  constructor(private readonly productsRepository: ProductsRepository) {}
  async createProduct(
    createProductDTO: CreateProductDTO,
    tx: PrismaTransactionalClient = null,
  ): Promise<Product> {
    try {
      const product = await this.productsRepository.create(
        createProductDTO,
        tx,
      );

      return product;
    } catch (error) {
      this.logger.error(
        `Failed to create product ${JSON.stringify(createProductDTO)}`,
      );
      this.logger.error(error);
      this.logger.error(JSON.stringify(error));

      if (error instanceof PrismaClientKnownRequestError) {
        const { code } = error;
        if (code === 'P2002') {
          throw new BadRequestException({
            isSuccess: false,
            error: 'VALIDATION_FAILED',
            message:
              'Another entry has the same value for attributes:[' +
              error.meta?.target +
              ']',
          });
        }
      }

      throw new InternalServerErrorException({
        isSuccess: false,
        message: 'Product not created',
        error: 'INTERNAL_SERVER_EXCEPTION',
      });
    }
  }

  async linkProductToCategories(
    productId: string,
    categoryIds: string[],
    tx: PrismaTransactionalClient = null,
  ) {
    try {
      const links = categoryIds.map((categoryId) => ({
        productId,
        categoryId,
      }));

      await this.productsRepository.linkProductToCategories(links, tx);
    } catch (error) {
      this.logger.error(
        `Failed to link product ${productId} to categories ${categoryIds}`,
      );
      this.logger.error(error);

      throw new InternalServerErrorException({
        isSuccess: false,
        message: 'Failed to link product to category',
        error: 'INTERNAL_SERVER_EXCEPTION',
      });
    }
  }

  async getProductDetails(productId: string) {
    try {
      const product = await this.productsRepository.find(productId);
      if (!product) {
        throw new NotFoundException({
          isSuccess: false,
          error: 'NOT_FOUND',
          message: 'Product not found',
        });
      }

      return {
        isSuccess: true,
        product,
      };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;

      this.logger.warn(
        `Failed to retrieve product details for productId ${productId}`,
      );
      this.logger.error(error);

      throw new InternalServerErrorException({
        isSuccess: false,
        message: 'Failed to retrieve product details',
        error: 'INTERNAL_SERVER_EXCEPTION',
      });
    }
  }
}
