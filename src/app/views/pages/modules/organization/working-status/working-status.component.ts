import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { WorkingStatusService } from './working-status.service';
import { WorkingStatusFormComponent } from './working-status-form.component';

@Component({
    templateUrl: './working-status.component.html',
    styleUrls: ['./working-status.component.scss']
})
export class WorkingStatusComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
    workings: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

    constructor(private cdr: ChangeDetectorRef,
                private workingStatusService: WorkingStatusService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
                private notify: SnackToastService,
    ) { }

    ngOnInit() {
        this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<WorkingStatusFormComponent, any>;
        const data = this.workings.find(x => x.id === id);
        instance = this.dialog.open(WorkingStatusFormComponent, {
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
                    const w: any = res;
                    const index = this.workings.findIndex(x => x.id === w.id);
                    if (index > -1) {
                        this.workings[index] = w;
                    } else {
                        this.workings.unshift(w);
                    }
                })).subscribe({
                    next: res => this.notify.when('success', res, this.resetFlags),
                    error: e => [this.notify.when('danger', e, this.resetFlags)],
                });
    }

    resetFlags = () => [this.isLoadingResults = false];


    private initData() {
        this.cdr.markForCheck();
        this.workings = [];
        this.isLoadingResults = true;

        this.workingStatusService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.workings = (res || []);
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.workingStatusService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.workings.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.workings.splice(index, 1);
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
