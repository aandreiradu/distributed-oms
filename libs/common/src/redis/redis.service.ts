import { createClient } from 'redis';

export class RedisService {
  private readonly client;

  constructor() {
    this.client = createClient();
  }
}
