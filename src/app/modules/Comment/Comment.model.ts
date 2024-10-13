import mongoose, { Schema } from 'mongoose';
import { IComment } from './Comment.interface';

const CommentSchema: Schema = new Schema(
  {
    post: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'GardeningPost',
      required: true,
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    content: { type: String, required: true },
    replies: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Comment' }], // For nested replies
    isDeleted: { type: Boolean, default: false }, // Soft delete for the comment
  },
  { timestamps: true }
);

const Comment = mongoose.model<IComment>('Comment', CommentSchema);

export default Comment;
