import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  UsePipes,
} from '@nestjs/common';
import { CategoriesService } from './categories.service';
import { ZodValidationPipe } from '@app/common/pipes/ZodValidation';
import { CreateCategoryDTO, CreateCategorySchema } from './dto/create-category';
import { UpdateCategoryDTO, UpdateCategorySchema } from './dto/update-category';

@Controller('categories')
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateCategorySchema))
  async createCategoryHandler(@Body() categoryDTO: CreateCategoryDTO) {
    return this.categoriesService.createCategory(categoryDTO);
  }

  @Put(':categoryId')
  async updateCategoryHandler(
    @Body(new ZodValidationPipe(UpdateCategorySchema))
    updateCategoryDTO: UpdateCategoryDTO,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoriesService.updateCategory(categoryId, updateCategoryDTO);
  }

  @Delete(':categoryId')
  async deleteCategory(@Param('categoryId') categoryId: string) {}
}
