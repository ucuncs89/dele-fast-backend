import { Body, Controller, Post } from '@nestjs/common';
import { ApiBody, ApiTags } from '@nestjs/swagger';
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
  @ApiBody({})
  async webhook(@Body() body: any) {
    const checkPayment = await this.midtransService.statusTransaction(
      body.transaction_id,
    );

    if (checkPayment) {
      console.log(checkPayment);

      return await this.orderService.updateByTransactionId(
        checkPayment.transaction_id,
        checkPayment.transaction_status,
      );
    }
    return true;
  }
}
