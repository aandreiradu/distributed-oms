import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product';
import { Product, ProductCategory } from '@prisma/client';
import { PrismaService } from '@app/common';
import { PrismaTransactionalClient } from '@app/common/types/prisma';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async createProduct(
    productDTO: CreateProductDTO,
    tx: PrismaTransactionalClient = null,
  ): Promise<Product> {
    const client = tx ? tx : this.prismaService;

    return client.product.create({
      data: {
        name: productDTO.name,
        sku: productDTO.sku,
        stock: productDTO.stock,
        description: productDTO.description,
      },
    });
  }

  async linkProductToCategories(
    links: { productId: string; categoryId: string }[],
    tx: PrismaTransactionalClient = null,
  ) {
    const client = tx ? tx : this.prismaService;

    return client.productCategory.createMany({ data: links });
  }
}
