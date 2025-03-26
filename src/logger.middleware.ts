
import { Logger } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

const _log = new Logger('Logger', {timestamp: true})
export function logger(req: Request, res: Response, next: NextFunction) {  
    _log.log(`Get New Request: ${req.url}`);
    next();
};
