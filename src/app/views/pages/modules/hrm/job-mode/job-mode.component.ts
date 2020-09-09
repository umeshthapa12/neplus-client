import { takeUntil, tap, filter, delay, switchMap } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ResponseModel } from '../../../../../models';
import { fadeInOutStagger, ExtendedMatDialog } from './../../../../../utils';
import { DeleteConfirmComponent, SnackToastService } from './../../../../shared';
import { JobModeFormComponent } from './job-mode-form.component';
import { JobModeService } from './job-mode.service';

@Component({
    templateUrl: './job-mode.component.html',
    styleUrls: ['./job-mode.component.scss'],
    animations: [fadeInOutStagger]
})
export class JobModeComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    jobModes: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;
    constructor(
        private cdr: ChangeDetectorRef,
        private jobModeService: JobModeService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
        private snackBar: SnackToastService,
    ) { }

    ngOnInit() {
        this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<JobModeFormComponent, any>;
        const data = this.jobModes.find(x => x.id === id);
        instance = this.dialog.open(JobModeFormComponent, {
            width: '400px',
            data: data ? data : {},
            autoFocus: false,
        });
        this.dialogUtil.animateBackdropClick(instance);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(res => res && res),
                tap(res => {
                    // console.log(res);
                    this.cdr.markForCheck();
                    const j: any = res;
                    const index = this.jobModes.findIndex(x => x.id === j.id);
                    if (index > -1) {
                        this.jobModes[index] = j;
                    } else {
                        this.jobModes.unshift(j);
                    }
                }))
            .subscribe(res =>
                this.onSuccess(res),
                e => this.onError(e));
    }
    private initData() {
        this.cdr.markForCheck();
        this.jobModes = [];
        this.isLoading = true;

        this.jobModeService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(500))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.jobModes = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
    }

    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.jobModeService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.jobModes.findIndex(x => x.id === id);
                if (index > -1) {
                    this.jobModes.splice(index, 1);
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
