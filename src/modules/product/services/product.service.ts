import { Injectable } from '@nestjs/common';
import { GetProductListDto, ProductDto } from '../dto/product.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { AppErrorNotFoundException } from 'src/exceptions/app-exception';

@Injectable()
export class ProductService {
  constructor(private prismaService: PrismaService) {}
  async create(productDto: ProductDto, user_id: number) {
    const data = await this.prismaService.product.create({
      data: { ...productDto },
    });
    return { ...data, user_id };
  }
  async findAll(getProductListDto: GetProductListDto, user_id?) {
    console.log(getProductListDto.type);

    const data = await this.prismaService.product.findMany({
      where: {
        type: getProductListDto.type,
        name: { contains: getProductListDto.search },
      },
      skip: getProductListDto.page,
      take: getProductListDto.page_size,
    });
    const count = await this.prismaService.product.count({
      where: {
        type: getProductListDto.type,
        name: { contains: getProductListDto.search },
      },
    });
    return { data, count, user_id };
  }

  async findOne(id: number, user_id: number) {
    const data = await this.prismaService.product.findFirst({ where: { id } });
    if (!data) {
      throw new AppErrorNotFoundException("Product doesn't exist");
    }
    return data;
  }
}
