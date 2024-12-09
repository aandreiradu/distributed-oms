import { HttpException, HttpExceptionOptions } from '@nestjs/common';

export class ResourceLockException extends HttpException {
  constructor(
    objectOrError?: string | object | any,
    descriptionOrOptions?: string | HttpExceptionOptions,
  ) {
    super(objectOrError, 412, { description: "The resource it's locked!" });
  }
}
