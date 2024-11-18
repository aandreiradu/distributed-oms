import { Logger } from '@nestjs/common';

/* 
TODO: for high concurrency with repeated lock requests, consider implementing a queing mechanism
*/
export class LockResource {
  private static lockSet: Set<string> = new Set();
  static async lock<T>(key: string, func: () => Promise<T>, log = false) {
    const logger = new Logger('Lock');

    if (LockResource.lockSet.has(key)) {
      if (log) logger.log(`${key} is already locked`);
      return;
    }

    LockResource.lockSet.add(key);

    try {
      return func();
    } catch (error) {
      logger.error(`Error occurred while locked for key ${key}:`, error);
    } finally {
      LockResource.lockSet.delete(key);
    }
  }
}
