import { Types } from 'mongoose';

export interface IPayment {
  // Unique identifier for the payment transaction
  transactionId: string;

  // Reference to the user who made the payment
  userId: Types.ObjectId;

  // Payment amount and currency
  totalPrice: number;
  currency: 'USD' | 'EUR' | 'GBP' | 'BDT' | 'INR';

  // Payment status
  paymentStatus: 'pending' | 'completed' | 'failed';

  // Timestamps for creation and update
  createdAt?: Date;
  updatedAt?: Date;
}
