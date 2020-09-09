import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fadeInOutStagger, ExtendedMatDialog } from './../../../../../utils';
import { ResponseModel } from './../../../../../models';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { AttendanceDevicesFormComponent } from './attendance-devices-form.component';
import { AttendanceDevicesService } from './attendance-devices.service';


@Component({
    templateUrl: './attendance-devices.component.html',
    styleUrls: ['../attendance.component.scss'],
    animations: [fadeInOutStagger]
})
export class AttendanceDevicesComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    attendanceDevices: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    constructor(
        private cdr: ChangeDetectorRef,
        private attendanceDeviceService: AttendanceDevicesService,
        private snackBar: SnackToastService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
    ) { }

    ngOnInit() {
        this.initData();
    }
    onAction(id: number) {
        let instance: MatDialogRef<AttendanceDevicesFormComponent, any>;
        const data = this.attendanceDevices.find(x => x.id === id);
        instance = this.dialog.open(AttendanceDevicesFormComponent, {
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
                    const a: any = res;
                    const index = this.attendanceDevices.findIndex(x => x.id === a.id);
                    if (index > -1) {
                        this.attendanceDevices[index] = a;
                    } else {
                        this.attendanceDevices.unshift(a);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initData() {
        this.cdr.markForCheck();
        this.attendanceDevices = [];
        this.isLoading = true;

        this.attendanceDeviceService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.attendanceDevices = (res || []);
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
                switchMap(() => this.attendanceDeviceService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.attendanceDevices.findIndex(x => x.id === id);
                if (index > -1) {
                    this.attendanceDevices.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
