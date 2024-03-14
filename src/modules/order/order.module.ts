import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MidtransService } from 'src/midtrans/midtrans.service';
import { OrderWebhookController } from './controllers/order-webhook.controller';

@Module({
  controllers: [OrderController, OrderWebhookController],
  providers: [OrderService, PrismaService, MidtransService],
})
export class OrderModule {}
