import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/modules/auth/jwt-auth.guard';
import { OrderCartDto } from '../dto/order.dto';
import { OrderCartService } from '../services/order-cart.service';

@ApiTags('order-cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
@Controller('order-cart')
export class OrderCartController {
  constructor(private readonly orderCartService: OrderCartService) {}
  @Post()
  async addCart(@Req() req, @Body() orderCartDto: OrderCartDto) {
    const data = await this.orderCartService.addCart(orderCartDto, req.user.id);
    return { data };
  }
  @Get()
  async findOne(@Req() req) {
    const data = await this.orderCartService.findCartByUserId(req.user.id);
    return { data };
  }
  @Delete(':order_id/:product_id')
  async deleteCart(
    @Req() req,
    @Param('order_id') order_id: number,
    @Param('product_id') product_id: number,
  ) {
    const data = await this.orderCartService.deleteCartDetail(
      +order_id,
      +product_id,
      req.user.id,
    );
    return { data };
  }
}
