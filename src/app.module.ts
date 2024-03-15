import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaService } from './prisma/prisma.service';
import { AuthModule } from './modules/auth/auth.module';
import { ProductModule } from './modules/product/product.module';
import { OrderModule } from './modules/order/order.module';
import { TextbookModule } from './modules/textbook/textbook.module';

@Module({
  imports: [AuthModule, ProductModule, OrderModule, TextbookModule],
  controllers: [AppController],
  providers: [AppService, PrismaService],
})
export class AppModule {}
