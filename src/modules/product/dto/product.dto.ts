import { ApiProperty } from '@nestjs/swagger';

export enum ProductTypeEnum {
  QUIZ = 'QUIZ',
  MEDIA = 'MEDIA',
  TEXT = 'TEXT',
}
export class ProductDto {
  @ApiProperty()
  name: string;

  @ApiProperty()
  description: string;

  @ApiProperty()
  price: number;

  @ApiProperty({ enum: ProductTypeEnum })
  type: ProductTypeEnum;
}
export class GetProductListDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;

  @ApiProperty({ enum: ProductTypeEnum, required: false })
  type?: ProductTypeEnum;

  @ApiProperty({ required: false })
  search?: string;
}
