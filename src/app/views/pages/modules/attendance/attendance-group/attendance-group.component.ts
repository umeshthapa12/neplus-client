import { takeUntil, delay, filter, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from './../../../../../models/app.model';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { fadeInOutStagger, ExtendedMatDialog } from './../../../../../utils';
import { AttendanceGroupService } from './attendance-group.service';
import { AttendanceGroupFormComponent } from './attendance-group-form.component';

@Component({
    templateUrl: './attendance-group.component.html',
    styleUrls: ['../attendance.component.scss'],
    animations: [fadeInOutStagger]
})
export class AttendanceGroupComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    attendanceGroups: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    constructor(
        private cdr: ChangeDetectorRef,
        private attendanceService: AttendanceGroupService,
        private snackBar: SnackToastService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
    ) { }

    ngOnInit() {
        this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<AttendanceGroupFormComponent, any>;
        const data = this.attendanceGroups.find(x => x.id === id);
        instance = this.dialog.open(AttendanceGroupFormComponent, {
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
                    const index = this.attendanceGroups.findIndex(x => x.id === a.id);
                    if (index > -1) {
                        this.attendanceGroups[index] = a;
                    } else {
                        this.attendanceGroups.unshift(a);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initData() {
        this.cdr.markForCheck();
        this.attendanceGroups = [];
        this.isLoading = true;

        this.attendanceService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.attendanceGroups = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
    }
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.attendanceService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.attendanceGroups.findIndex(x => x.id === id);
                if (index > -1) {
                    this.attendanceGroups.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
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

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
