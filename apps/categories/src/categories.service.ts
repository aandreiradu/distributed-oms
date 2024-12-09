import {
  BadRequestException,
  Inject,
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { CreateCategoryDTO } from './dto/create-category';
import { CategoriesRepository } from './categories.repository';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';
import { UpdateCategoryDTO } from './dto/update-category';
import { PrismaTransactionalClient } from '@app/common/types/prisma';
import { Category } from '@prisma/client';
import { LockDistriburedResource } from '@app/common/utils/lockDS';
import { ResourceLockException } from '@app/common/errors/ResourceLock.error';

@Injectable()
export class CategoriesService {
  private readonly logger: Logger = new Logger(CategoriesService.name);
  constructor(
    private readonly categoriesRepository: CategoriesRepository,

    private readonly lockDS: LockDistriburedResource,
  ) {}

  async createCategory(categoryDTO: CreateCategoryDTO) {
    try {
      const category = await this.categoriesRepository.createCategory(
        categoryDTO,
      );

      return {
        isSuccess: true,
        category: category,
      };
    } catch (error) {
      this.logger.error(
        `Failed to create category with payload ${JSON.stringify(categoryDTO)}`,
      );
      this.logger.error(error);
      this.logger.error(JSON.stringify(error));

      if (error instanceof PrismaClientKnownRequestError) {
        const { code } = error;
        if (code === 'P2002') {
          throw new BadRequestException({
            isSuccess: false,
            message: 'Category not created',
            error: 'Another category with the same name already exists',
          });
        }
      }

      throw new InternalServerErrorException({
        isSuccess: false,
        message: 'Category not created',
        error: 'INTERNAL_SERVER_EXCEPTION',
      });
    }
  }

  async updateCategory(categoryId: string, categoryDTO: UpdateCategoryDTO) {
    try {
      const existingCategory = await this.categoriesRepository.findById(
        categoryId,
      );

      if (!existingCategory) {
        throw new BadRequestException({
          isSuccess: false,
          message: 'Category not found',
          error: 'BAD_REQUEST_EXCEPTION',
        });
      }

      return await this.lockDS.lock(categoryId, async () => {
        const updatedCategory = await this.categoriesRepository.update(
          categoryId,
          categoryDTO,
        );

        return {
          isSuccess: true,
          category: updatedCategory,
        };
      });
    } catch (error) {
      if (error instanceof ResourceLockException) {
        throw new BadRequestException({
          isSuccess: false,
          error: 'RESOURCE_ALREADY_LOCKED',
          message: error.message,
        });
      }

      if (error instanceof BadRequestException) throw error;

      this.logger.error(
        `Failed to update category ${JSON.stringify(categoryDTO)}`,
      );
      this.logger.error(JSON.stringify(error));
      this.logger.error(error);

      throw new InternalServerErrorException({
        isSuccess: false,
        message: 'Category not updated',
        error: 'INTERNAL_SERVER_EXCEPTION',
      });
    }
  }

  async validateCategories(
    categoryNames: string[],
    tx: PrismaTransactionalClient = null,
  ): Promise<Category[]> {
    try {
      const categories = await this.categoriesRepository.getCategoryListByName(
        categoryNames,
        tx,
      );

      if (categories.length !== categoryNames.length) {
        throw new BadRequestException({
          isSuccess: false,
          message: 'Some categories do not exist',
          error: 'VALIDATION_FAILED',
        });
      }

      return categories;
    } catch (error) {
      if (error instanceof BadRequestException) throw error;

      this.logger.error(`Failed to validate categories ${categoryNames}`);
      this.logger.error(error);

      throw new BadRequestException({
        isSuccess: false,
        message: 'Internal server exception occured',
        error: 'INTERNAL_SERVER_EXCEPTION',
      });
    }
  }

  async deleteCategory(categoryId: string): Promise<void> {
    try {
    } catch (error) {}
  }
}
