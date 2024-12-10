import { Body, Controller, Get, Param, Post, UsePipes } from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDTO, CreateProductSchema } from './dto/create-product';
import { ZodValidationPipe } from '@app/common/pipes/ZodValidation';
import { ProductsFacade } from './products.facade';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsFacade: ProductsFacade) {}

  @Post()
  @UsePipes(new ZodValidationPipe(CreateProductSchema))
  async createProduct(@Body() createProductDTO: CreateProductDTO) {
    return this.productsFacade.createProduct(createProductDTO);
  }

  @Get(':productId')
  async getProductDetails(@Param('productId') productId: string) {
    return this.productsFacade.getProductDetails(productId);
  }
}
