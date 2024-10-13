import { ObjectId } from 'mongoose';

export interface ISavedPost {
  _id: ObjectId | string;
  user: ObjectId | string;
  post: ObjectId | string;
  isDeleted: boolean;
}
