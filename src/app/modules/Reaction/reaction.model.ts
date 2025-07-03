import mongoose from 'mongoose';
import { IReaction } from './reaction.interface';
const { Schema } = mongoose;

const reactionSchema = new Schema<IReaction>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    post: {
      type: Schema.Types.ObjectId || String,
      ref: 'Post',
      required: true,
    },
    isDeleted: { type: Boolean, default: false },
    type: {
      type: String,
      enum: ['like', 'dislike'],
      required: true,
    },
  },
  { timestamps: true }
);

reactionSchema.pre('find', function (next) {
  this.where({ isDeleted: false });
  next();
});
reactionSchema.pre('findOne', function (next) {
  this.where({ isDeleted: false });
  next();
});

const Reaction = mongoose.model<IReaction>('Reaction', reactionSchema);

export default Reaction;
