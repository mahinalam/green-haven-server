import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { IGuide } from './Blogs.interface';

const blogSchema: Schema = new Schema(
  {
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    title: { type: String, required: true, trim: true },
    content: { type: String, required: true },
    images: { type: [String], default: [] },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'approved',
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

blogSchema.pre('find', function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ status: { $ne: 'rejected' } });
  next();
});
blogSchema.pre('findOne', function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ status: { $ne: 'rejected' } });
  next();
});

const Blog = mongoose.model<IGuide>('Blog', blogSchema);

export default Blog;
