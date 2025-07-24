import { Types } from 'mongoose';

export interface IReaction {
  _id?: Types.ObjectId;
  user: Types.ObjectId;
  post: Types.ObjectId;
  type: 'like' | 'dislike';
  isDeleted: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
