import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    console.log('----------------------------------------------------');
    console.log(`${req.method} ${req.originalUrl}`);
    console.log('Payload:', req.body);
    console.log('----------------------------------------------------');

    res.on('finish', () => {
      console.log(`${req.method} ${req.originalUrl} ${res.statusCode}`);
    });

    next();
  }
}
