import { Injectable } from '@nestjs/common';
import { GetListOrderDto, OrderDto } from '../dto/order.dto';
import { PrismaService } from 'src/prisma/prisma.service';

import {
  AppErrorException,
  AppErrorNotFoundException,
} from 'src/exceptions/app-exception';
import { UpdateTransactionDto } from '../dto/order-payment.dto';
import { ProductResponse } from '@prisma/client';

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
  async updateByTransactionId(
    transaction_id: string,
    transaction_status: string,
  ) {
    const order = await this.prismaService.order.findFirst({
      where: { transaction_id },
      include: { order_detail: true },
    });
    if (!order) {
      throw new AppErrorNotFoundException(
        'Order not found, transactio_id doesnt exists',
      );
    }
    const arrResponse: ProductResponse[] = [];
    if (order.order_detail.length < 1) {
      throw new AppErrorException('order detail items not found in order');
    }
    for (const detail of order.order_detail) {
      arrResponse.push({
        user_id: order.created_by,
        enroll_at: new Date(),
        is_enroll: true,
        product_id: detail.product_id,
      });
    }
    try {
      let trx2;
      const trx1 = await this.prismaService.order.updateMany({
        where: { transaction_id },
        data: {
          status: transaction_status,
        },
      });
      if (transaction_status === 'settlement') {
        trx2 = await this.prismaService.$transaction([
          this.prismaService.productResponse.createMany({
            data: arrResponse,
            skipDuplicates: true,
          }),
        ]);
      }
      return { trx1, trx2 };
    } catch (error) {
      throw new AppErrorException(error);
    }
  }
}
