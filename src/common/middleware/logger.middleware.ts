import { Request, Response, NextFunction } from 'express';
import { Logger } from '@nestjs/common';

export function logger(req: Request, res: Response, next: NextFunction) {
  const logger = new Logger('HTTP');
  const { ip, method, path: url } = req;
  const userAgent = req.get('user-agent') || '';

  res.on('close', () => {
    const { statusCode } = res;
    const contentLength = res.get('content-length');

    try {
      logger.log(
        `${method} ${url} ${statusCode} ${contentLength} - ${userAgent} ${ip}`,
        'info',
      );
    } catch (error) {
      console.error('Error in logger middleware:', error);
    }
  });

  next();
}
