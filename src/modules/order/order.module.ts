import { Module } from '@nestjs/common';
import { OrderService } from './services/order.service';
import { OrderController } from './controllers/order.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { MidtransService } from 'src/midtrans/midtrans.service';
import { OrderWebhookController } from './controllers/order-webhook.controller';
import { OrderCartController } from './controllers/order-cart.controller';
import { OrderCartService } from './services/order-cart.service';

@Module({
  controllers: [OrderController, OrderCartController, OrderWebhookController],
  providers: [OrderService, PrismaService, MidtransService, OrderCartService],
})
export class OrderModule {}
