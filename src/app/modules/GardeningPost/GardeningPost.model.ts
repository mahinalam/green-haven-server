import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IGardeningPost } from './GardeningPost.interface';

const GardeningPostSchema: Schema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    images: { type: [String], default: [] },
    isPremium: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ['published', 'draft', 'archived'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

GardeningPostSchema.pre('find', function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});
GardeningPostSchema.pre('findOne', function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});

const GardeningPost = mongoose.model<IGardeningPost>(
  'GardeningPost',
  GardeningPostSchema
);

export default GardeningPost;
