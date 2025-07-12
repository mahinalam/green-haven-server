import { Document, ObjectId } from 'mongoose';

export interface ISavedPost extends Document {
  _id: ObjectId | string;
  user: ObjectId | string;
  post: ObjectId | string;
  isDeleted: boolean;
}
