// Zod schema for validating ObjectId (used for post, user, and replies)
import { z } from 'zod';

// Zod validation schema for the Category model
const createCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }),
    isDeleted: z.boolean().optional().default(false), // Soft delete flag, default is false
  }),
});
const updateCategoryValidationSchema = z.object({
  body: z.object({
    name: z.string().min(1, { message: 'Name is required' }).optional(),
    isDeleted: z.boolean().optional().default(false), // Soft delete flag, default is false
  }),
});

export const CategoryValidationSchema = {
  createCategoryValidationSchema,
  updateCategoryValidationSchema,
};
