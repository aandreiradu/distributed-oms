import {
  Body,
  Controller,
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
  @UsePipes(new ZodValidationPipe(UpdateCategorySchema))
  async updateCategoryHandler(
    @Body() updateCategoryDTO: UpdateCategoryDTO,
    @Param('categoryId') categoryId: string,
  ) {
    return this.categoriesService.updateCategory(categoryId, updateCategoryDTO);
  }
}
