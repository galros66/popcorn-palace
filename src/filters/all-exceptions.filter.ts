
import { Catch, ArgumentsHost, Logger } from '@nestjs/common';
import { BaseExceptionFilter } from '@nestjs/core';

// Filter that catch all the exceotions and handle by log it to the user screen.
@Catch()
export class AllExceptionsFilter extends BaseExceptionFilter {
    private logger = new Logger(AllExceptionsFilter.name)
    catch(exception: unknown, host: ArgumentsHost) {
        // log the error to screen
        this.logger.error(`Exception chatch: ${exception}`);
        super.catch(exception, host);
    }
}
