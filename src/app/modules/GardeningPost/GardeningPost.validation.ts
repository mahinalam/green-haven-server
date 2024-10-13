import { z } from 'zod';

const createGardeningPostValidationSchema = z.object({
  body: z.object({
    user: z.string({ required_error: 'User is required' }),
    title: z.string().min(1, { message: 'Title is required' }).trim(),
    content: z.string().min(1, { message: 'Content is required' }),
    category: z.string({ required_error: 'Category is required' }),
    images: z.array(z.string().url()).optional().default([]), // Array of image URLs
    votes: z.number().optional().default(0), // Default is 0
    comments: z
      .array(
        z.string().regex(/^[0-9a-fA-F]{24}$/, {
          message: 'Invalid ObjectId for comment',
        })
      )
      .optional(),
    isPremium: z.boolean().optional().default(false),
    favoriteCount: z.number().optional().default(0),
    isDeleted: z.boolean().optional().default(false),
    status: z
      .enum(['published', 'draft', 'archived'])
      .optional()
      .default('draft'), // Enum validation
  }),
});
const updateGardeningPostValidationSchema = z.object({
  body: z.object({
    user: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId for user' })
      .optional(), // Optional user ID (ObjectId)
    title: z.string().trim().optional(), // Optional title
    content: z.string().optional(), // Optional content
    category: z
      .string()
      .regex(/^[0-9a-fA-F]{24}$/, { message: 'Invalid ObjectId for category' })
      .optional(), // Optional category (ObjectId)
    images: z.array(z.string().url()).optional(), // Optional array of image URLs
    votes: z.number().optional(), // Optional votes field
    comments: z
      .array(
        z.string().regex(/^[0-9a-fA-F]{24}$/, {
          message: 'Invalid ObjectId for comment',
        })
      )
      .optional(), // Optional array of comment ObjectIds
    isPremium: z.boolean().optional(), // Optional isPremium flag
    favoriteCount: z.number().optional(), // Optional favoriteCount field
    isDeleted: z.boolean().optional(), // Optional isDeleted flag
    status: z.enum(['published', 'draft', 'archived']).optional(), // Optional status
  }),
});

export const GardeningPostValidationSchema = {
  createGardeningPostValidationSchema,
  updateGardeningPostValidationSchema,
};
