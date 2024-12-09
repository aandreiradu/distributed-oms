import { z } from 'zod';

export const CreateProductSchema = z.object({
  name: z.string({ required_error: 'name is required' }),
  description: z.string().optional(),
  sku: z
    .string({ required_error: 'sku is required' })
    .min(6, { message: 'SKU should be at least 6 characters' })
    .max(22, { message: 'SKU cannot have more than 22 characters' }),
  stock: z.coerce
    .number()
    .min(0, { message: 'Stock cannot be negative' })
    .default(0),
  basePrice: z.coerce
    .number({ required_error: 'basePrice is required' })
    .min(0, { message: 'basePrice cannot be negative' }),
  currency: z.string().optional().default('RON'),
  discount: z.coerce.number().default(0),
  discountUnit: z.string().optional().default('%'),
  categories: z
    .string()
    .array()
    .min(1, { message: 'A product should belong to minimum one category' }),
});

export type CreateProductDTO = z.infer<typeof CreateProductSchema>;
