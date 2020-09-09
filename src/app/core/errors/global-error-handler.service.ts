import { HttpErrorResponse } from '@angular/common/http';
import { ErrorHandler, Injectable, Injector } from '@angular/core';
import { environment } from '../../../environments/environment';
import { SnackToastService } from '../../views/shared';
import { ErrorService } from './error.service';
import { LoggingService } from './logging.service';

@Injectable()
export class GlobalErrorHandler implements ErrorHandler {

    // Error handling is important and needs to be loaded first.
    // Because of this we should manually inject the services with Injector.
    constructor(private injector: Injector) { }

    handleError(error: Error | HttpErrorResponse) {

        const errorService = this.injector.get(ErrorService);
        const logger = this.injector.get(LoggingService);
        const notifier = this.injector.get(SnackToastService)

            .withOptions({ horizontalPosition: 'center', verticalPosition: 'bottom' });

        let message;
        let stackTrace;

        // toast when development mode is enabled
        if (!environment.production) {
            if (error instanceof HttpErrorResponse) {
                // Server Error
                message = errorService.getServerMessage(error);
                stackTrace = errorService.getServerStack(error);
                notifier.when('danger', error);
            } else {
                // Client Error
                message = errorService.getClientMessage(error);
                stackTrace = errorService.getClientStack(error);
                notifier.when('danger', { messageBody: message });
            }
        }

        // Always log errors
        logger.logError(message, stackTrace);

        console.error(error);
    }
}
