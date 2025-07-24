import { Types } from 'mongoose';

export interface IPayment {
  transactionId: string;
  userId: Types.ObjectId;
  totalPrice: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'BDT' | 'INR';
  paymentStatus: 'pending' | 'completed' | 'failed';
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
