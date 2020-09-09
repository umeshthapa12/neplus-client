import { Injectable } from '@angular/core';
import { MatSnackBar, MatSnackBarConfig, MatSnackBarRef } from '@angular/material/snack-bar';
import { ResponseModel } from '../../../models';
import { RandomUnique } from '../../../utils';
import { AlertType, AlertTypeClass, SnackbarModel, AlertTypeProps } from './extended-snackbar.model';
import { SnackToastComponent } from './toast.component';

@Injectable({ providedIn: 'root' })
export class SnackToastService {
    // toast model
    private model: SnackbarModel[] = [];
    // toast component ref
    private snack: MatSnackBarRef<SnackToastComponent>;
    private options: MatSnackBarConfig;

    constructor(private sb: MatSnackBar, private util: RandomUnique) {
        // default options
        this.options = {
            horizontalPosition: 'right',
            verticalPosition: 'top',
            duration: 20000,
            // data: items,
            panelClass: ['px-0', 'pt-0', 'pb-0', 'custom-snackbar', 'mat-elevation-z5']
        };
    }


    /**
     * extends options
     * @param options override options
     */
    withOptions(options?: MatSnackBarConfig) {
        this.options = { ...this.options, ...options };
        return this;
    }

    clearExisting() {
        this.model = [];
        this.snack.dismiss();
        return this;
    }

    /**
     * init snack bar and create stacked items with alert type. A custom extended snackbar.
     */
    initSnakbar(data: SnackbarModel) {

        setTimeout(() => {
            // internal config if user input isn't available or passed
            data.uid = this.util.uid();

            this.options.duration = this.options.duration ?? 20000;

            data.duration = this.options.duration;

            // reuse to track snackbar instance close until the length is 0;
            this.model.push({ ...data });

            // opening multiple snackbar instance is not possible, so we open it once and stacking alert boxes in it.
            if (!this.snack) {
                this.snack = this.sb.openFromComponent(SnackToastComponent, this.options);
            }

            // cleanup
            this.snack.afterDismissed().subscribe(_ => {
                this.model = [];
                this.snack = null;
            });

            // after assigning unique id for each alert, display to the UI
            this.snack.instance.items.next(this.model);
        }, 800);
    }

    /**
     * Initialize a toast based on snackbar. Custom extended mat-snackbar toast
     * @param res ResponseModel object contains user friendly information
     * @param status Toast status
     * @param fn Fn to invoke along with toast. Example: ```()=> fn```
     */
    when<A extends keyof AlertTypeProps, T extends ResponseModel, >(status: A, res: T, fn?: () => void) {

        const title = status === 'danger' ? (res as any).status + ' ' + ((res as any).statusText as any || 'Error') : status;

        const type = status === 'success' ? AlertType.success
            : status === 'danger' ? AlertType.Danger
                : status === 'warn' ? AlertType.Warn
                    : AlertType.Info;

        const cssClass = status === 'success' ? AlertTypeClass.success :
            status === 'danger' ? AlertTypeClass.Danger :
                status === 'warn' ? AlertTypeClass.Warn : AlertTypeClass.Info;

        const message = status === 'danger' ?
            (res.error && (res.error.messageBody || res.message) || `Something went wrong.`)
            : (res.messageBody || status);

        const c: SnackbarModel = {
            title,
            type,
            typeClass: cssClass,
            message
        };

        this.initSnakbar(c);

        // we may have some fn to call
        if (fn !== undefined && typeof (fn) === 'function') {
            fn();
        }

    }
}

