
import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const _log = new Logger('Request', {timestamp: true})
export function logger(req: Request, res: Response, next: NextFunction) {
    
    _log.log(`Get New Request: ${req.url}`);
    next();
};
