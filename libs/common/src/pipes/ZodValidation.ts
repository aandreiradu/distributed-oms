import {
  ArgumentMetadata,
  BadRequestException,
  PipeTransform,
} from '@nestjs/common';
import { ZodSchema } from 'zod';

export class ZodValidationPipe implements PipeTransform {
  constructor(private schema: ZodSchema) {}

  async transform(value: unknown, metadata: ArgumentMetadata) {
    try {
      const parsedValud = await this.schema.parseAsync(value);
      return parsedValud;
    } catch (error) {
      throw new BadRequestException('Validation failed');
    }
  }
}
