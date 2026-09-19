import { z } from 'zod'

export const progressStatusEnum = z.enum(['LEARNING', 'BUILDING', 'STUCK', 'WIN'])

export const createTrailSchema = z.object({
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .optional(),
  category: z
    .string()
    .max(50, 'Category must not exceed 50 characters')
    .optional(),
  status: progressStatusEnum,
  isPublic: z.boolean(),
})

export const updateTrailSchema = z.object({
  id: z.string(),
  title: z
    .string()
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  description: z
    .string()
    .max(500, 'Description must not exceed 500 characters')
    .nullable()
    .optional(),
  category: z
    .string()
    .max(50, 'Category must not exceed 50 characters')
    .nullable()
    .optional(),
  status: progressStatusEnum,
  isPublic: z.boolean(),
})

export const addTrailEntrySchema = z.object({
  trailId: z.string().min(1, 'Trail ID is required'),
  content: z
    .string()
    .min(3, 'Progress entry must be at least 3 characters')
    .max(2000, 'Progress entry is too long'),
  statusTag: progressStatusEnum,
  mediaUrl: z
    .string()
    .optional()
    .refine(
      (val) =>
        !val ||
        val === '' ||
        val.startsWith('http://') ||
        val.startsWith('https://') ||
        val.startsWith('data:image/'),
      { message: 'Please enter a valid image URL' }
    ),
  imageData: z
    .string()
    .optional()
    .refine(
      (val) => !val || val === '' || val.startsWith('data:image/'),
      { message: 'Please provide a valid image payload.' }
    ),
})

export const updateTrailEntrySchema = z.object({
  entryId: z.string().min(1, 'Entry ID is required'),
  content: z
    .string()
    .min(3, 'Progress entry must be at least 3 characters')
    .max(2000, 'Progress entry is too long'),
  statusTag: progressStatusEnum,
  mediaUrl: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) =>
        !val ||
        val === '' ||
        val.startsWith('http://') ||
        val.startsWith('https://') ||
        val.startsWith('data:image/'),
      { message: 'Please enter a valid image URL' }
    ),
  imageData: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => !val || val === '' || val.startsWith('data:image/'),
      { message: 'Please provide a valid image payload.' }
    ),
})

export type CreateTrailInput = z.infer<typeof createTrailSchema>
export type UpdateTrailInput = z.infer<typeof updateTrailSchema>
export type AddTrailEntryInput = z.infer<typeof addTrailEntrySchema>
export type UpdateTrailEntryInput = z.infer<typeof updateTrailEntrySchema>
