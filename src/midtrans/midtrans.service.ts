import { Injectable } from '@nestjs/common';
import * as midtransClient from 'midtrans-client';
import { env } from 'process';
import { AppErrorException } from 'src/exceptions/app-exception';
import {
  OrderPaymentDto,
  PaymentTypeEnum,
} from 'src/modules/order/dto/order-payment.dto';

@Injectable()
export class MidtransService {
  private coreApi: midtransClient.CoreApi;

  constructor() {
    this.coreApi = new midtransClient.CoreApi({
      isProduction: false,
      serverKey: env.MIDTRANS_SERVER_KEY,
      clientKey: env.MIDTRANS_CLIENT_KEY,
    });
  }

  async createTransaction(
    order_id: number,
    amount: number,
    orderPaymentDto: OrderPaymentDto,
  ) {
    try {
      let parameter: object = {};
      if (orderPaymentDto.payment_type === PaymentTypeEnum.bank_transfer_bni) {
        parameter = {
          transaction_details: {
            order_id: `${order_id}-${Date.now()}`,
            gross_amount: amount,
          },
          payment_type: 'bank_transfer',
          bank_transfer: { bank: 'bni' },
        };
      } else if (
        orderPaymentDto.payment_type === PaymentTypeEnum.bank_transfer_permata
      ) {
        parameter = {
          transaction_details: {
            order_id: `${order_id}-${Date.now()}`,
            gross_amount: amount,
          },
          payment_type: 'bank_transfer',
          bank_transfer: { bank: 'permata' },
        };
      } else if (
        orderPaymentDto.payment_type === PaymentTypeEnum.bank_transfer_bca
      ) {
        parameter = {
          transaction_details: {
            order_id: `${order_id}-${Date.now()}`,
            gross_amount: amount,
          },
          payment_type: 'bank_transfer',
          bank_transfer: { bank: 'bca' },
        };
      }

      const transaction = await this.coreApi.charge(parameter);
      return transaction;
    } catch (error) {
      console.log(error);

      throw new AppErrorException(error);
    }
  }

  async statusTransaction(transaction_id: string) {
    const data = await this.coreApi.transaction.status(transaction_id);
    return data;
  }
  async cancelTransaction(transaction_id: string) {
    try {
      const data = await this.coreApi.transaction.cancel(transaction_id);
      return data;
    } catch (error) {
      throw new AppErrorException(error.message);
    }
  }
}
