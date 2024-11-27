import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string({ required_error: 'name is required' }),
  description: z.string().optional(),
});

export type CreateCategoryDTO = z.infer<typeof CreateCategorySchema>;
