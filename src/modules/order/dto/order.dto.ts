import { ApiProperty } from '@nestjs/swagger';

export class OrderDetailDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  name: string;

  @ApiProperty()
  quantity: number;

  @ApiProperty()
  price: number;

  order_id: number;
  sub_total: number;
  created_by: number;
}
export class OrderDto {
  @ApiProperty({
    isArray: true,
    type: OrderDetailDto,
  })
  order_details: OrderDetailDto[];
}
export class GetListOrderDto {
  @ApiProperty({ required: false })
  page: number;

  @ApiProperty({ required: false })
  page_size: number;
}
export class OrderCartDto {
  @ApiProperty()
  product_id: number;

  @ApiProperty()
  quantity: number;

  // name: string;
  // price: number;
  // order_id: number;
  // sub_total: number;
  // created_by: number;
}
