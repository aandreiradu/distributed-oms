import { Injectable } from '@nestjs/common';
import { CreateProductDTO } from './dto/create-product';
import { Product, ProductCategory } from '@prisma/client';
import { PrismaService } from '@app/common';
import { PrismaTransactionalClient } from '@app/common/types/prisma';

@Injectable()
export class ProductsRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async create(
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

  async find(productId: string): Promise<Product> {
    return this.prismaService.product.findFirst({
      where: { id: productId },
      include: {
        attributes: true,
        pricing: true,
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
