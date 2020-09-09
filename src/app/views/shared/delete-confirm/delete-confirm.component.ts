import { Component, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialogRef } from '@angular/material/dialog';
import { tap, delay } from 'rxjs/operators';

@Component({
    templateUrl: './delete-confirm.component.html'
})

export class DeleteConfirmComponent implements OnDestroy {
    isWorking = false;
    private toDestroy$ = new Subject<void>();

    constructor(
        private dialogRef: MatDialogRef<DeleteConfirmComponent>
    ) {
        this.dialogRef._containerInstance._config.autoFocus = false;
        this.dialogRef.updateSize('250px', '200px');
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    deleted() {
        this.isWorking = true;

        setTimeout(() => {
            this.dialogRef.close(true);
            this.isWorking = false;
        }, 1500);
    }
}
