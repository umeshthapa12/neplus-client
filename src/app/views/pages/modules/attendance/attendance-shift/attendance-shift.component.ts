import { Subject } from 'rxjs';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from './../../../../../models/app.model';
import { ExtendedMatDialog, fadeInOutStagger } from './../../../../../utils';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { AttendanceShiftService } from './attendance-shift.service';
import { AttendanceShiftFormComponent } from './attendance-shift-form.component';

@Component({
    templateUrl: './attendance-shift.component.html',
    styleUrls: ['../attendance.component.scss'],
    animations: [fadeInOutStagger]
})
export class AttendanceShiftComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    attendanceShifts: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    constructor(
        private cdr: ChangeDetectorRef,
        private attendanceShiftService: AttendanceShiftService,
        private snackBar: SnackToastService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
    ) { }

    ngOnInit() {
        this.initData();
    }
    onAction(id: number) {
        let instance: MatDialogRef<AttendanceShiftFormComponent, any>;
        const data = this.attendanceShifts.find(x => x.id === id);
        instance = this.dialog.open(AttendanceShiftFormComponent, {
            width: '500px',
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
                    const index = this.attendanceShifts.findIndex(x => x.id === s.id);
                    if (index > -1) {
                        this.attendanceShifts[index] = s;
                    } else {
                        this.attendanceShifts.unshift(s);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initData() {
        this.cdr.markForCheck();
        this.attendanceShifts = [];
        this.isLoading = true;

        this.attendanceShiftService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(500))
            .subscribe(r => {
                this.cdr.markForCheck();
                this.attendanceShifts = (r || []);
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
        let instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.attendanceShiftService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.attendanceShifts.findIndex(x => x.id === id);
                if (index > -1) {
                    this.attendanceShifts.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
