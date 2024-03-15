import { Injectable } from '@nestjs/common';
import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { PrismaService } from 'src/prisma/prisma.service';
import { OrderCartDto } from '../dto/order.dto';

@Injectable()
export class OrderCartService {
  constructor(private prismaService: PrismaService) {}
  async addCart(orderCartDto: OrderCartDto, user_id: number) {
    const product = await this.prismaService.product.findFirst({
      where: { id: orderCartDto.product_id },
    });
    if (!product) {
      throw new AppErrorNotFoundException('Product Not Found');
    }
    const orderExists = await this.findCartByUserId(user_id);
    let order_id: number;
    if (!orderExists) {
      const createOrder = await this.prismaService.order.create({
        data: {
          created_at: new Date(),
          gross_amount: 0,
          status: 'CART',
          created_by: user_id,
        },
      });
      order_id = createOrder.id;
    } else {
      order_id = orderExists.id;
    }
    try {
      const dataOrderDetail = await this.prismaService.orderDetail.findFirst({
        where: {
          order_id,
          product_id: orderCartDto.product_id,
        },
      });
      if (!dataOrderDetail) {
        await this.prismaService.orderDetail.create({
          data: {
            created_at: new Date(),
            created_by: user_id,
            name: product.name,
            order_id,
            product_id: orderCartDto.product_id,
            price: product.price,
            quantity: orderCartDto.quantity,
            sub_total: orderCartDto.quantity * product.price,
          },
        });
      } else {
        const sub_total: number =
          (dataOrderDetail.quantity + orderCartDto.quantity) *
          dataOrderDetail.price;
        await this.prismaService.orderDetail.update({
          where: {
            order_id_product_id: {
              order_id,
              product_id: orderCartDto.product_id,
            },
          },
          data: {
            quantity: { increment: orderCartDto.quantity },
            sub_total,
          },
        });
      }
      const sumOrderDetail = await this.prismaService.orderDetail.aggregate({
        _sum: { sub_total: true },
        where: { order_id },
      });
      const updateGrandTotal = await this.prismaService.order.update({
        where: { id: order_id },
        data: { gross_amount: sumOrderDetail._sum.sub_total },
      });
      return { updateGrandTotal };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }

  async findCartByUserId(user_id: number) {
    const data = await this.prismaService.order.findFirst({
      where: { created_by: user_id, status: 'CART' },
      include: { order_detail: true },
    });
    return data;
  }
  async deleteCartDetail(
    order_id: number,
    product_id: number,
    user_id: number,
  ) {
    return await this.prismaService.orderDetail.delete({
      where: {
        order_id_product_id: { order_id, product_id },
        created_by: user_id,
      },
    });
  }
}
