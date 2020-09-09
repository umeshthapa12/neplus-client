import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { AttendanceFormComponent } from './attendance-form.component';
import { ResponseModel } from '../../../../../../../../src/app/models';
import { SnackToastService, DeleteConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { AttendanceService } from './attendance.service';
import { fadeInOutStagger, ExtendedMatDialog } from '../../../../../../../../src/app/utils';

@Component({
    templateUrl: './attendance.component.html',
    styleUrls: [],
    animations: [fadeInOutStagger]
})
export class AttendanceComponent implements OnInit, OnDestroy {
    attendanceDetails: any[] = [];

    private toDestroy$ = new Subject<void>();

    // trun on/off loading bar/placeholder when http request being made
    isLoading: boolean;

    constructor(
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private snackBar: SnackToastService,
        private dialogUtil: ExtendedMatDialog,
        private attendanceService: AttendanceService
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.attendanceService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(700))
            .subscribe(_ => [
                this.cdr.markForCheck(),
                this.attendanceDetails = _,
                this.isLoading = false],
                e => this.onError(e));
    }

    // E.G. https://netbasal.com/angular-2-improve-performance-with-trackby-cc147b5104e5
    trackById = (_: number, item: any) => item.id;


    onAction(id: number) {

        let instance: MatDialogRef<AttendanceFormComponent, any>;
        const data = this.attendanceDetails.find(_ => _.id === id);
        instance = this.dialog.open(AttendanceFormComponent, {
            width: '500px',
            data: data ? data : {},
            autoFocus: false,
        });

        instance.afterClosed().pipe(
            takeUntil(this.toDestroy$),
            filter(res => res && res),
            tap(res => {
                this.cdr.markForCheck();
                const d: any = res;
                const index = this.attendanceDetails.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    this.attendanceDetails[index] = d;
                } else {
                    this.attendanceDetails.unshift(d);
                }
            })
        ).subscribe(res => this.onSuccess(res), e => this.onError(e));

        this.dialogUtil.animateBackdropClick(instance);
    }

    delete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(
                takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.attendanceService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.attendanceDetails.findIndex(_ => _.id === id);
                if (index > -1) {
                    this.attendanceDetails.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
    }

    private onSuccess(res: ResponseModel) {

        this.cdr.markForCheck();
        this.snackBar.when('success', res);
        this.isLoading = false;

    }

    private onError(ex: any) {

        this.cdr.markForCheck();
        this.snackBar.when('danger', ex);
        this.isLoading = false;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
