import { takeUntil, delay, filter, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from '../../../../../models';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog, fadeInOutStagger } from './../../../../../utils';
import { JobAllocationTypeService } from './job-allocation-type.service';
import { JobAllocationTypeFormComponent } from './job-allocation-type-form.component';

@Component({
    templateUrl: './job-allocation-type.component.html',
    styleUrls: ['./job-allocation-type.component.scss'],
    animations: [fadeInOutStagger],
})
export class JobAllocationTypeComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    jobAllocations: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    constructor(
        private cdr: ChangeDetectorRef,
        private jobAllocationService: JobAllocationTypeService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
        private snackBar: SnackToastService,
    ) { }

    ngOnInit() {
        this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<JobAllocationTypeFormComponent, any>;
        const data = this.jobAllocations.find(x => x.id === id);
        instance = this.dialog.open(JobAllocationTypeFormComponent, {
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
                    const j: any = res;
                    const index = this.jobAllocations.findIndex(x => x.id === j.id);
                    if (index > -1) {
                        this.jobAllocations[index] = j;
                    } else {
                        this.jobAllocations.unshift(j);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }
    private initData() {
        this.cdr.markForCheck();
        this.jobAllocations = [];
        this.isLoading = true;

        this.jobAllocationService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(500))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.jobAllocations = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
    }
    onDelete(id: number) {
        let instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.jobAllocationService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.jobAllocations.findIndex(x => x.id === id);
                if (index > -1) {
                    this.jobAllocations.splice(index, 1);
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
