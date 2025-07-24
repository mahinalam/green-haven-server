// models/Follow.ts
import mongoose, { Schema } from 'mongoose';
import { IFollow } from './follower.interface';

const followSchema = new Schema<IFollow>(
  {
    follower: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    following: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

// Prevent duplicate follows
followSchema.index({ follower: 1, following: 1 }, { unique: true });

export const Follow = mongoose.model<IFollow>('Follow', followSchema);
