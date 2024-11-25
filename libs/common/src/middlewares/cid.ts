import { Injectable, NestMiddleware } from '@nestjs/common';
import * as crypto from 'node:crypto';
import { Request, Response } from 'express';

@Injectable()
export class CidMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: (error?: any) => void) {
    const cid = crypto.randomUUID();
    req.headers['X-DOMS-CorrelationId'] = cid;
    res.setHeader('X-DOMS-CorrelationId', cid);
    next();
  }
}
