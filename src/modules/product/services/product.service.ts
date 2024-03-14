import { Injectable } from '@nestjs/common';
import {
  GetProductListDto,
  ProductDto,
  ProductTypeEnum,
} from '../dto/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppErrorNotFoundException } from 'src/exceptions/app-exception';
import { ResProductInterface } from '../interfaces/product.interface';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}
  async create(productDto: ProductDto, user_id: number) {
    const data = await this.prismaService.product.create({
      data: { ...productDto },
    });
    return { ...data, user_id };
  }
  async findAll(
    getProductListDto: GetProductListDto,
    user_id?,
  ): Promise<{ data: ResProductInterface[]; count: number }> {
    const take = getProductListDto.page_size ? getProductListDto.page_size : 10;
    const skip = getProductListDto.page
      ? (getProductListDto.page - 1) * take
      : 0;
    const data = await this.prismaService.product.findMany({
      where: {
        AND: [
          {
            type: getProductListDto.type,
            name: { contains: getProductListDto.search, mode: 'insensitive' },
          },
          {
            type: getProductListDto.type,
            description: {
              contains: getProductListDto.search,
              mode: 'insensitive',
            },
          },
          {
            product_response: { every: { user_id } },
          },
        ],
      },
      include: {
        product_response: true,
      },
      skip,
      take,
    });
    const arrResult: ResProductInterface[] = [];
    for (const result of data) {
      arrResult.push({
        ...result,
        product_response: result.product_response[0] || null,
      });
    }
    const count = await this.prismaService.product.count({
      where: {
        type: getProductListDto.type,
        name: { contains: getProductListDto.search },
      },
    });
    return { data: arrResult, count };
  }

  async findOne(id: number, user_id: number): Promise<ResProductInterface> {
    const product = await this.prismaService.product.findFirst({
      where: { id, product_response: { every: { user_id } } },
      include: { product_response: true },
    });
    if (!product) {
      throw new AppErrorNotFoundException("Product doesn't exist");
    }
    let detail: object;
    switch (product.type) {
      case ProductTypeEnum.MEDIA:
        detail = await this.prismaService.media.findFirst({
          where: { id: product.relation_id },
        });
        break;
      case ProductTypeEnum.TEXT:
        detail = await this.prismaService.textbook.findFirst({
          where: { id: product.relation_id },
        });
        break;
      case ProductTypeEnum.QUIZ:
        detail = await this.prismaService.quiz.findFirst({
          where: { id: product.relation_id },
        });
        break;
      default:
        detail = null;
        break;
    }
    return {
      ...product,
      product_response: product.product_response[0] || null,
      detail,
    };
  }
}
