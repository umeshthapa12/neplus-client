import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { DeleteConfirmComponent, SnackToastService } from './../../../../shared';
import { fadeInOutStagger, ExtendedMatDialog } from './../../../../../utils';
import { ResponseModel } from './../../../../../models/app.model';
import { AttendanceShiftWorkingService } from './attendance-shift-working.service';
import { AttendanceShiftWorkingFormComponent } from './attendance-shift-working-form.component';

@Component({
    templateUrl: './attendance-shift-working.component.html',
    styleUrls: ['../attendance.component.scss'],
    animations: [fadeInOutStagger]
})
export class AttendanceShiftWorkingComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    shiftWorking: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    constructor(
        private cdr: ChangeDetectorRef,
        private shiftWorkingService: AttendanceShiftWorkingService,
        private snackBar: SnackToastService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
    ) { }

    ngOnInit() {
        this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<AttendanceShiftWorkingFormComponent, any>;
        const data = this.shiftWorking.find(x => x.id === id);
        instance = this.dialog.open(AttendanceShiftWorkingFormComponent, {
            width: '400px',
            data: data ? data : {},
            autoFocus: false,
        });
        this.dialogUtil.animateBackdropClick(instance);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(res => res && res),
                tap(res => {
                    this.cdr.markForCheck();
                    const s: any = res;
                    const index = this.shiftWorking.findIndex(x => x.id === s.id);
                    if (index > -1) {
                        this.shiftWorking[index] = s;
                    } else {
                        this.shiftWorking.unshift(s);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initData() {
        this.cdr.markForCheck();
        this.shiftWorking = [];
        this.isLoading = true;

        this.shiftWorkingService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(500))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.shiftWorking = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
    }

    private onSuccess(res: ResponseModel) {
        this.cdr.markForCheck();
        this.snackBar.when('success', res);
        this.isLoading = false;
    }

    private onError(e: any) {
        this.cdr.markForCheck();
        this.snackBar.when('danger', e);
        this.isLoading = false;
    }
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.shiftWorkingService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.shiftWorking.findIndex(x => x.id === id);
                if (index > -1) {
                    this.shiftWorking.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
