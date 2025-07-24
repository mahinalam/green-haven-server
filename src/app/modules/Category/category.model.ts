import mongoose, { Schema } from 'mongoose';
import { ICategory } from './category.interface';

const CategorySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CategorySchema.pre('find', function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});
CategorySchema.pre('findOne', function (next) {
  // Apply the `isDeleted: false` filter to every find query
  this.where({ isDeleted: false });
  next();
});

const Category = mongoose.model<ICategory>('Category', CategorySchema);

export default Category;
