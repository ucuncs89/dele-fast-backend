import { ApiProperty } from '@nestjs/swagger';
export enum PaymentTypeEnum {
  bank_transfer_permata = 'bank_transfer_permata',
  bank_transfer_bni = 'bank_transfer_bni',
  bank_transfer_bca = 'bank_transfer_bca',
}

export class OrderPaymentDto {
  @ApiProperty({ enum: PaymentTypeEnum })
  payment_type: PaymentTypeEnum;
}

export class UpdateTransactionDto {
  transaction_id: string;

  transaction_time: string;

  transaction_status: string;

  midtrans_order_id: string;

  merchant_id: string;
}
