import { Injectable } from '@nestjs/common';
import { GetListOrderDto, OrderDto } from '../dto/order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import { AppErrorNotFoundException } from 'src/exceptions/app-exception';
import { UpdateTransactionDto } from '../dto/order-payment.dto';

@Injectable()
export class OrderService {
  constructor(private prismaService: PrismaService) {}
  async create(orderDto: OrderDto, user_id: number) {
    const orderExists = await this.findCartByUserId(user_id);
    if (orderExists) {
      const data = await this.update(orderExists.id, orderDto, user_id);
      return data;
    }
    for (const detail of orderDto.order_details) {
      detail.sub_total = detail.price * detail.quantity;
      detail.created_by = user_id;
    }
    const gross_amount = orderDto.order_details.reduce(
      (total, item) => total + item.sub_total,
      0,
    );
    const data = await this.prismaService.order.create({
      data: {
        gross_amount,
        status: 'CART',
        created_by: user_id,
        order_detail: {
          create: orderDto.order_details,
        },
      },
    });
    return data;
  }

  async findCartByUserId(user_id: number) {
    const data = await this.prismaService.order.findFirst({
      where: { created_by: user_id, status: 'CART' },
    });
    return data;
  }

  async findAll(query: GetListOrderDto, user_id: number) {
    const take: any = query.page_size ? query.page_size : 10;
    const skip: any = query.page ? (query.page - 1) * take : 0;
    const data = await this.prismaService.order.findMany({
      where: { created_by: user_id },
      include: { order_detail: true },
      skip: parseInt(skip),
      take: parseInt(take),
    });
    const count = await this.prismaService.order.count({
      where: { created_by: user_id },
    });
    return { data, count };
  }

  async findOne(id: number) {
    const data = await this.prismaService.order.findFirst({
      where: { id },
      include: { order_detail: true },
    });
    if (!data) {
      throw new AppErrorNotFoundException('Order Not Found');
    }
    return data;
  }

  async update(id: number, orderDto: OrderDto, user_id: number) {
    for (const detail of orderDto.order_details) {
      detail.sub_total = detail.price * detail.quantity;
      detail.created_by = user_id;
    }
    const gross_amount = orderDto.order_details.reduce(
      (total, item) => total + item.sub_total,
      0,
    );
    const [trxOrderDetailDelete, trxCreateOrUpdate] =
      await this.prismaService.$transaction([
        this.prismaService.orderDetail.deleteMany({
          where: { order_id: id, product_id: undefined },
        }),
        this.prismaService.order.update({
          where: { id, created_by: user_id },
          data: {
            gross_amount,
            created_by: user_id,
            order_detail: {
              create: orderDto.order_details,
            },
          },
        }),
      ]);
    return { trxOrderDetailDelete, trxCreateOrUpdate };
  }
  async updateTransaction(
    id: number,
    updateTransactionDto: UpdateTransactionDto,
  ) {
    return await this.prismaService.order.update({
      where: { id },
      data: {
        transaction_id: updateTransactionDto.transaction_id,
        status: updateTransactionDto.transaction_status,
      },
    });
  }
  async updateWebhook(transaction_id: string, status: string) {
    return await this.prismaService.order.updateMany({
      where: { transaction_id },
      data: {
        status,
      },
    });
  }
}
