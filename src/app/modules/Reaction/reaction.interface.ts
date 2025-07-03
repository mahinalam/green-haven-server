import { Types } from 'mongoose';

export interface IReaction {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  post: Types.ObjectId;
  type: 'like' | 'dislike';
  isDeleted: Boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
