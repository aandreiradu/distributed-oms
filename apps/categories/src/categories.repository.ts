import { PrismaService } from '@app/common';
import { Injectable, Logger } from '@nestjs/common';
import { CreateCategoryDTO } from './dto/create-category';
import { Category } from '@prisma/client';
import { UpdateCategoryDTO } from './dto/update-category';
import { PrismaTransactionalClient } from '@app/common/types/prisma';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly prismaService: PrismaService) {}

  async findById(id: string): Promise<Category | null> {
    return this.prismaService.category.findUnique({
      where: { id },
    });
  }
  async findByName(name: string): Promise<Category | null> {
    return this.prismaService.category.findUnique({
      where: { name },
    });
  }
  async createCategory(categoryDTO: CreateCategoryDTO): Promise<Category> {
    return this.prismaService.category.create({
      data: {
        ...categoryDTO,
        name: categoryDTO.name,
      },
    });
  }

  async getCategoryListByName(
    categoryName: string[],
    tx: PrismaTransactionalClient = null,
  ): Promise<Category[]> {
    const client = tx ? tx : this.prismaService;

    return client.category.findMany({
      where: {
        name: { in: categoryName },
      },
    });
  }

  async update(categoryId: string, categoryDTO: UpdateCategoryDTO) {
    return this.prismaService.category.update({
      where: { id: categoryId },
      data: categoryDTO,
    });
  }

  async delete(categoryId: string) {
    return this.prismaService.category.delete({
      where: { id: categoryId },
    });
  }
}
