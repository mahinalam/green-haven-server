import mongoose, { model, Schema } from 'mongoose';
import { IShare } from './postShare.interface';

const PostShareSchema = new Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GardeningPost',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // the original creator of the post
      required: true,
    },
    sharedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User', // the person who shared it
      required: true,
    },
    title: {
      type: String,
    },
    isDeleted: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

PostShareSchema.pre('find', function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});
PostShareSchema.pre('findOne', function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});

export const PostShare = model<IShare>('PostShare', PostShareSchema);
