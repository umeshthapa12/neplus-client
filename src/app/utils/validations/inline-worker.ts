import { Observable, Subject } from 'rxjs';

export class InlineWorker {

    private readonly worker: Worker;
    private onMessage = new Subject<MessageEvent>();
    private onError = new Subject<ErrorEvent>();

    constructor(func) {

        const WORKER_ENABLED = !!(Worker);

        if (WORKER_ENABLED) {
            /**
             * converts a function to a string and creates ObjectURL which will be passed to a worker class through a
             * constructor.
             */
            const functionBody = func.toString().replace(/^[^{]*{\s*/, '').replace(/\s*}[^}]*$/, '');
            // passed to a worker class through a constructor.
            this.worker = new Worker(URL.createObjectURL(
                new Blob([functionBody], { type: 'text/javascript' })
            ));

            this.worker.onmessage = (data) => {
                this.onMessage.next(data);
            };

            this.worker.onerror = (data) => {
                this.onError.next(data);
            };

        } else {
            throw new Error('WebWorker is not enabled');
        }
    }

    postMessage(data) {
        this.worker.postMessage(data);
    }

    onmessage(): Observable<MessageEvent> {
        return this.onMessage.asObservable();
    }

    onerror(): Observable<ErrorEvent> {
        return this.onError.asObservable();
    }

    terminate() {
        if (this.worker) {
            this.worker.terminate();
        }
    }
}
