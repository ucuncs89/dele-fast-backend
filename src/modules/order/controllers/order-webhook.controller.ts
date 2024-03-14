import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { OrderService } from '../services/order.service';
import { MidtransService } from 'src/midtrans/midtrans.service';

@ApiTags('order/webhook')
@Controller('order/webhook-notification')
export class OrderWebhookController {
  constructor(
    private readonly orderService: OrderService,
    private readonly midtransService: MidtransService,
  ) {}
  @Post()
  async webhook(@Body() body: any) {
    const checkPayment = await this.midtransService.statusTransaction(
      body.transaction_id,
    );
    if (checkPayment) {
      this.orderService.updateWebhook(
        checkPayment.transaction_id,
        checkPayment.status,
      );
    }
    return true;
  }
}
