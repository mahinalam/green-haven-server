import mongoose from 'mongoose';
import { model } from 'mongoose';
import { IPayment } from './payment.interace';

const paymentSchema = new mongoose.Schema(
  {
    // Unique identifier for the payment transaction
    transactionId: {
      type: String,
      required: true,
      unique: true,
    },

    // Reference to the user who made the payment
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // Payment amount and currency
    totalPrice: {
      type: Number,
      required: true,
    },
    currency: {
      type: String,
      enum: ['USD', 'EUR', 'GBP', 'BDT', 'INR', 'BDT'], // Expand with relevant currencies
      default: 'BDT',
      required: true,
    },

    // Payment status (pending, completed, failed)
    paymentStatus: {
      type: String,
      enum: ['pending', 'paid', 'failed'],
      default: 'pending',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

paymentSchema.pre('find', function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});
paymentSchema.pre('findOne', function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});

export const Payment = model<IPayment>('Payment', paymentSchema);
