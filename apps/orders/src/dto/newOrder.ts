import { z } from 'zod';

export const OrderStatus = z.enum([
  'WAITING_FOR_SELLER_CONFIRMATION',
  'RECEIVED',
  'PENDING',
  'ACCEPTED',
  'ON_HOLD',
  'REJECTED',
  'CANCELED',
]);

export const NewOrderDTOSchema = z.object({
  productId: z.string().min(1, { message: 'productId is required' }),
  quantity: z.string(),
});

export type NewOrderDTO = z.infer<typeof NewOrderDTOSchema>;
