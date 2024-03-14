import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
} from '@nestjs/common';
import { ProductService } from '../services/product.service';
import { GetProductListDto, ProductDto } from '../dto/product.dto';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { Pagination } from 'src/utils/pagination';

@ApiTags('prdouct')
@ApiBearerAuth()
@Controller('product')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @UseGuards(JwtAuthGuard)
  @Post()
  async create(@Req() req, @Body() productDto: ProductDto) {
    const data = await this.productService.create(productDto, req.user.id);
    return { data };
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Req() req, @Query() getProductListDto: GetProductListDto) {
    const result = await this.productService.findAll(
      getProductListDto,
      req.user.id,
    );
    const pagination = await Pagination.pagination(
      result.count || 0,
      getProductListDto.page,
      getProductListDto.page_size,
      `product`,
    );
    return { ...result, pagination };
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  async findOne(@Req() req, @Param('id') id: number) {
    const data = await this.productService.findOne(+id, req.user.id);
    return { data };
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() updateProductDto: UpdateProductDto) {
  //   return this.productService.update(+id, updateProductDto);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.productService.remove(+id);
  // }
}
