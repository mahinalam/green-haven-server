import { Document } from "mongoose";

export interface IContact extends Document {
  name: string;
  email: string;
  message: string;
  isDeleted?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
