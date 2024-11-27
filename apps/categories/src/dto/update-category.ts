import { z } from 'zod';

export const UpdateCategorySchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export type UpdateCategoryDTO = z.infer<typeof UpdateCategorySchema>;
