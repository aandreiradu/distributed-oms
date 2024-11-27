import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  async transform(value: unknown, metadata: ArgumentMetadata) {
    const result = await this.schema.safeParseAsync(value);

    if (!result.success) {
      const errorDetails = result.error.errors.map((err) => ({
        path: err.path.join('.'),
        message: err.message,
      }));

      throw new BadRequestException({
        isSuccess: false,
        message: 'Validation failed',
        errors: errorDetails,
      });
    }

    return result.data;
  }
}
