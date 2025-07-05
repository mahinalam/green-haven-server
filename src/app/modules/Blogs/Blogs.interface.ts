import { Types } from 'mongoose';

export interface IGuide {
  _id: Types.ObjectId;
  author: Types.ObjectId;
  title: string;
  content: string;
  images?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  createdAt?: Date;
  updatedAt?: Date;
}
