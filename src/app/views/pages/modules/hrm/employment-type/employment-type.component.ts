import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { SnackToastService } from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { DeleteConfirmComponent } from './../../../../shared';
import { EmploymentTypeFormComponent } from './employment-type-form.component';
import { EmploymentTypeService } from './employment-type.service';

@Component({
    templateUrl: './employment-type.component.html',
    styleUrls: ['./employment-type.component.scss']
})
export class EmploymentTypeComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    employments: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

    constructor(private cdr: ChangeDetectorRef,
                private employmentService: EmploymentTypeService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
                private notify: SnackToastService,
    ) { }

    ngOnInit() {
        this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<EmploymentTypeFormComponent, any>;
        const data = this.employments.find(x => x.id === id);
        instance = this.dialog.open(EmploymentTypeFormComponent, {
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
                    const e: any = res;
                    const index = this.employments.findIndex(x => x.id === e.id);
                    if (index > -1) {
                        this.employments[index] = e;
                    } else {
                        this.employments.unshift(e);
                    }
                })).subscribe({
                    next: res => this.notify.when('success', res, this.resetFlags),
                    error: e => [this.notify.when('danger', e, this.resetFlags)]
                });

    }

    resetFlags = () => [this.isLoadingResults = false];

    private initData() {
        this.cdr.markForCheck();
        this.employments = [];
        this.isLoadingResults = true;

        this.employmentService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.employments = (res || []);
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.employmentService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.employments.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.employments.splice(index, 1);
                    }
                    this.notify.when('success', res, this.resetFlags);
                }, error: e => [this.notify.when('danger', e, this.resetFlags)]
            });
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
