import { InlineWorker } from './inline-worker';

/**
 * Diagnosing utility.
 */
export class Diagnostic {
    static result = 0;
    /**
     * Checks whether the storage is enabled
     * @info https://developer.mozilla.org/en-US/docs/Web/API/Web_Storage_API/
     * Using_the_Web_Storage_API#Feature-detecting_localStorage
     * @param type name of the storage to test
     */
    static storageAvailable(type: string) {
        let storage;
        try {
            storage = window[type];
            const x = '__storage_test__';
            storage.setItem(x, x);
            storage.removeItem(x);
            return true;
        } catch (e) {
            return e instanceof DOMException && (
                // everything except Firefox
                e.code === 22 ||
                // Firefox
                e.code === 1014 ||
                // test name field too, because code might not be present
                // everything except Firefox
                e.name === 'QuotaExceededError' ||
                // Firefox
                e.name === 'NS_ERROR_DOM_QUOTA_REACHED') &&
                // acknowledge QuotaExceededError only if there's something already stored
                (storage && storage.length !== 0);
        }
    }

    /**
     * Gets the user agent name with version if available.
     */
    static userAgent(): string {
        const ua = navigator.userAgent;
        let tem;
        let M = ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
        if (/trident/i.test(M[1])) {
            tem = /\brv[ :]+(\d+)/g.exec(ua) || [];
            return 'IE ' + (tem[1] || '') as string;
        }
        if (M[1] === 'Chrome') {
            tem = ua.match(/\b(OPR|Edge)\/(\d+)/);
            if (tem != null) { return tem.slice(1).join(' ').replace('OPR', 'Opera'); }
        }
        M = M[2] ? [M[1], M[2]] : [navigator.appName, navigator.appVersion, '-?'];
        if ((tem = ua.match(/version\/(\d+)/i)) != null) { M.splice(1, 1, tem[1]); }
        return M.join(' ') as string;
    }

    /**
     * Gets the boolean value from the API which indicates whether the software (client/backend/database) versions are
     * compatible.
     */
    static isLatestAppVersion() {
        // TODO: we need to check installed version and the latest version of software.
       return true;
    }

    // demo only. we will use later
    static initWorker() {
        const worker = new InlineWorker(function() {
            const self: InlineWorker = this;
            // START OF WORKER THREAD CODE
            console.log('Start worker thread, wait for postMessage: ');

            const calculateCountOfPrimeNumbers = (limit) => {

                const isPrime = num => {
                    for (let i = 2; i < num; i++) {
                        if (num % i === 0) { return false; }
                    }
                    return num > 1;
                };

                let countPrimeNumbers = 0;

                while (limit >= 0) {
                    if (isPrime(limit)) { countPrimeNumbers += 1; }
                    limit--;
                }

                // this is from DedicatedWorkerGlobalScope ( because of that we have postMessage and onmessage methods )
                // and it can't see methods of this class
                // @ts-ignore
                self.postMessage({
                    primeNumbers: countPrimeNumbers
                });
            };

            // @ts-ignore
            self.onmessage = (evt) => {
                console.log('Calculation started: ' + new Date());
                calculateCountOfPrimeNumbers(evt.data.limit);
            };
            // END OF WORKER THREAD CODE
        });

        worker.postMessage({ limit: 300000 });

        worker.onmessage().subscribe((data) => {
            console.log('Calculation done: ', new Date() + ' ' + JSON.stringify(data.data));
            Diagnostic.result = data.data.primeNumbers;
            worker.terminate();
        });

        worker.onerror().subscribe((data) => {
            console.log(data);
        });
    }
}
