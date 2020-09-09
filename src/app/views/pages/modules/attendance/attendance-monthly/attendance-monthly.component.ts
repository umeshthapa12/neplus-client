import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from './../../../../../models/app.model';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { fadeInOutStagger, ExtendedMatDialog } from './../../../../../utils';
import { AttendanceMonthlyService } from './attendance-monthly.service';
import { AttendanceMonthlyFormComponent } from './attendance-monthly-form.component';

@Component({
    templateUrl: './attendance-monthly.component.html',
    styleUrls: ['../attendance.component.scss'],
    animations: [fadeInOutStagger]
})
export class AttendanceMonthlyComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    isLoading = true;
    attendanceMonthly: any[] = [];
    trackById = (_: number, item: any) => item.id;

    constructor(
        private cdr: ChangeDetectorRef,
        private attendanceMonthlyService: AttendanceMonthlyService,
        private snackBar: SnackToastService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
    ) { }

    ngOnInit() {
        this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<AttendanceMonthlyFormComponent, any>;
        const data = this.attendanceMonthly.find(x => x.id === id);
        instance = this.dialog.open(AttendanceMonthlyFormComponent, {
            width: '600px',
            data: data ? data : {},
            autoFocus: false,
        });
        this.dialogUtil.animateBackdropClick(instance);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(res => res && res),
                tap(res => {
                    this.cdr.markForCheck();
                    const a: any = res;
                    const index = this.attendanceMonthly.findIndex(x => x.id === a.id);
                    if (index > -1) {
                        this.attendanceMonthly[index] = a;
                    } else {
                        this.attendanceMonthly.unshift(a);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initData() {
        this.cdr.markForCheck();
        this.attendanceMonthly = [];
        this.isLoading = true;

        this.attendanceMonthlyService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(500))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.attendanceMonthly = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading]);
    }

    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.attendanceMonthlyService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.attendanceMonthly.findIndex(x => x.id === id);
                if (index > -1) {
                    this.attendanceMonthly.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
    }

    onSuccess(res: ResponseModel) {
        this.cdr.markForCheck();
        this.snackBar.when('success', res);
        this.isLoading = false;
    }

    onError(e: any) {
        this.cdr.markForCheck();
        this.snackBar.when('danger', e);
        this.isLoading = false;
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
