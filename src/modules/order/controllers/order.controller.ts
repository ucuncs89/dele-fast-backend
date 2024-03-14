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

@ApiTags('order')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order')
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

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
}
