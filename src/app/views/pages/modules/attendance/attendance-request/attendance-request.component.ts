import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fadeInOutStagger , ExtendedMatDialog} from './../../../../../utils';
import { ResponseModel } from './../../../../../models';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { AttendanceRequestService } from './attendance-request.service';
import { AttendanceRequestFormComponent } from './attendance-request-form.component';

@Component({
    templateUrl: './attendance-request.component.html',
    styleUrls: ['../attendance.component.scss'],
    animations: [fadeInOutStagger]
})
export class AttendanceRequestComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    attendanceRequest: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    constructor(
        private cdr: ChangeDetectorRef,
        private attendanceRequestService: AttendanceRequestService,
        private snackBar: SnackToastService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
    ) { }
    ngOnInit() {
        this.initDate();
    }
    onAction(id: number) {
        let instance: MatDialogRef<AttendanceRequestFormComponent, any>;
        const data = this.attendanceRequest.find(x => x.id === id);
        instance = this.dialog.open(AttendanceRequestFormComponent, {
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
                    const r: any = res;
                    const index = this.attendanceRequest.findIndex(x => x.id === r.id);
                    if (index > -1) {
                        this.attendanceRequest[index] = r;
                    } else {
                        this.attendanceRequest.unshift(r);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initDate() {
        this.cdr.markForCheck();
        this.attendanceRequest = [];
        this.isLoading = true;

        this.attendanceRequestService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(500))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.attendanceRequest = (res || []);
                this.isLoading = false;
            }, e => [this.cdr.markForCheck(), this.isLoading = false]);
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
                switchMap(() => this.attendanceRequestService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.attendanceRequest.findIndex(x => x.id === id);
                if (index > -1) {
                    this.attendanceRequest.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
