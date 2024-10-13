import mongoose from 'mongoose';
import { Schema } from 'mongoose';
import { ISavedPost } from './savedPost.interface';

const SavedPostSchema: Schema = new Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId || String,
      ref: 'User',
      required: true,
    },
    post: {
      type: mongoose.Schema.Types.ObjectId || String,
      ref: 'GardeningPost',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const SavedPost = mongoose.model<ISavedPost>('SavedPost', SavedPostSchema);

export default SavedPost;
