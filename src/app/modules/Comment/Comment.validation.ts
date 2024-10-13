// Zod schema for validating ObjectId (used for post, user, and replies)
import { Types } from 'mongoose';
import { z } from 'zod';

const objectIdSchema = z.string().refine((val) => Types.ObjectId.isValid(val), {
  message: 'Invalid ObjectId',
});

// Zod validation schema for the Comment model
const createCommentValidationSchema = z.object({
  body: z.object({
    post: objectIdSchema,
    user: objectIdSchema,
    content: z.string().min(1, { message: 'Content is required' }),
    replies: z.array(objectIdSchema).optional(), // Array of ObjectIds for nested replies (optional)
    isDeleted: z.boolean().optional().default(false), // Soft delete flag, default is false
    createdAt: z.date().optional(), // Automatically managed, optional in the schema
    updatedAt: z.date().optional(), // Automatically managed, optional in the schema
  }),
});
const updateCommentValidationSchema = z.object({
  body: z.object({
    content: z.string().optional(),
  }),
});

export const CommentValidationSchema = {
  createCommentValidationSchema,
  updateCommentValidationSchema,
};
