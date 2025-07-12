import { Document, Types } from 'mongoose';

export interface IFollow extends Document {
  follower: Types.ObjectId; // the user who follows
  following: Types.ObjectId; // the user being followed
  createdAt: Date;
}
