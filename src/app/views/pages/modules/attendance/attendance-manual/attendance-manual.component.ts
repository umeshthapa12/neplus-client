import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, AfterViewInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from './../../../../../models/app.model';
import { fadeInOutStagger, ExtendedMatDialog } from './../../../../../utils';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { AttendanceManualService } from './attendance-manual.service';
import { AttendanceManualFormComponent } from './attendance-manual-form.component';

@Component({
    templateUrl: './attendance-manual.component.html',
    styleUrls: ['../attendance.component.scss'],
    animations: [fadeInOutStagger]
})
export class AttendanceManualComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    attendanceManuals: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    constructor(
        private cdr: ChangeDetectorRef,
        private attendanceManualService: AttendanceManualService,
        private snackBar: SnackToastService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
    ) { }

    ngOnInit() {
        this.initDate();
    }

    onAction(id: number) {
        let instance: MatDialogRef<AttendanceManualFormComponent, any>;
        const data = this.attendanceManuals.find(x => x.id === id);
        instance = this.dialog.open(AttendanceManualFormComponent, {
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
                    const a: any = res;
                    const index = this.attendanceManuals.findIndex(x => x.id === a.id);
                    if (index > -1) {
                        this.attendanceManuals[index] = a;
                    } else {
                        this.attendanceManuals.unshift(a);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initDate() {
        this.cdr.markForCheck();
        this.attendanceManuals = [];
        this.isLoading = true;

        this.attendanceManualService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.attendanceManuals = (res || []);
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
                filter(yes => yes),
                switchMap(() => this.attendanceManualService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.attendanceManuals.findIndex(x => x.id === id);
                if (index > -1) {
                    this.attendanceManuals.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
