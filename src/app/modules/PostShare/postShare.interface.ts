import { Types } from 'mongoose';

export interface IShare {
  _id?: Types.ObjectId;
  post: Types.ObjectId;
  user: Types.ObjectId; // Original post creator
  sharedBy: Types.ObjectId; // The user who shared
  createdAt?: Date;
  updatedAt?: Date;
}
