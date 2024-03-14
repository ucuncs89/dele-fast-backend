import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Req,
  Query,
  Put,
} from '@nestjs/common';
import { OrderService } from '../services/order.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { GetListOrderDto, OrderDto } from '../dto/order.dto';
import { Pagination } from 'src/utils/pagination';
import { AppErrorNotFoundException } from 'src/exceptions/app-exception';
import { MidtransService } from 'src/midtrans/midtrans.service';
import { OrderPaymentDto } from '../dto/order-payment.dto';

@ApiTags('order')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(
    private readonly orderService: OrderService,
    private readonly midtransService: MidtransService,
  ) {}

  @Post()
  async create(@Req() req, @Body() orderDto: OrderDto) {
    return this.orderService.create(orderDto, req.user.id);
  }

  @Get()
  async findAll(@Req() req, @Query() query: GetListOrderDto) {
    const result = await this.orderService.findAll(query, req.user.id);
    const pagination = await Pagination.pagination(
      result.count || 0,
      query.page,
      query.page_size,
      `order`,
    );
    return { ...result, pagination };
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    const data = await this.orderService.findOne(+id);
    return { data };
  }

  @Get(':id/status-transaction')
  async findStatusOne(@Param('id') id: string) {
    const data = await this.orderService.findOne(+id);
    if (!data.transaction_id) {
      throw new AppErrorNotFoundException('data transaction not found');
    }
    const payment = await this.midtransService.statusTransaction(
      data.transaction_id,
    );
    this.orderService.updateTransaction(+id, {
      merchant_id: payment.merchant_id,
      transaction_id: payment.transaction_id,
      transaction_time: payment.transaction_time,
      transaction_status: payment.transaction_status,
      midtrans_order_id: payment.order_id,
    });
    return { data, payment };
  }

  @Put(':id')
  async update(
    @Req() req,
    @Param('id') id: string,
    @Body() orderDto: OrderDto,
  ) {
    const order = await this.orderService.findOne(+id);
    if (!order) {
      throw new AppErrorNotFoundException();
    }
    const data = await this.orderService.update(+id, orderDto, req.user.id);
    return { data };
  }

  @Post(':id/create-transaction')
  async createTransaction(
    @Req() req,
    @Body() paymentDto: OrderPaymentDto,
    @Param('id') id: number,
  ) {
    const order = await this.orderService.findOne(+id);
    if (!order) {
      throw new AppErrorNotFoundException();
    }
    if (order.transaction_id) {
      const data = await this.midtransService.statusTransaction(
        order.transaction_id,
      );
      return { message: 'Already Exists', data };
    }
    const data = await this.midtransService.createTransaction(
      order.id,
      order.gross_amount,
      paymentDto,
    );
    if (data) {
      this.orderService.updateTransaction(+id, {
        merchant_id: data.merchant_id,
        transaction_id: data.transaction_id,
        transaction_time: data.transaction_time,
        transaction_status: data.transaction_status,
        midtrans_order_id: data.order_id,
      });
    }
    return { data };
  }

  @Post(':id/cancel-transaction')
  async canceltransaction(@Param('id') id: string) {
    const data = await this.orderService.findOne(+id);
    if (!data.transaction_id) {
      throw new AppErrorNotFoundException('data transaction not found');
    }
    const payment = await this.midtransService.cancelTransaction(
      data.transaction_id,
    );
    this.orderService.updateTransaction(+id, {
      merchant_id: payment.merchant_id,
      transaction_id: payment.transaction_id,
      transaction_time: payment.transaction_time,
      transaction_status: payment.transaction_status,
      midtrans_order_id: payment.order_id,
    });
    return { data, payment };
  }
}
