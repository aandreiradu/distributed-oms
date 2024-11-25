import { IncomingHttpHeaders } from 'http';
import { Request } from 'express';

export interface DOMSHeaders extends IncomingHttpHeaders {
  'X-DOMS-CorrelationId': string;
}

export interface DOMSRequest extends Request {
  headers: DOMSHeaders;
}
