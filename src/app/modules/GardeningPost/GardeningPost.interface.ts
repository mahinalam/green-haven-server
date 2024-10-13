import { ObjectId } from 'mongoose';

export interface IGardeningPost {
  _id: ObjectId;
  user: ObjectId;
  title: string;
  content: string;
  category: ObjectId;
  images?: string[];
  votes: number;
  comments: ObjectId[];
  isPremimum: boolean;
  favoriteCount: number;
  isDeleted: boolean;
  status: 'published' | 'draft' | 'archived';
}
