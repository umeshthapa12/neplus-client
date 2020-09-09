import { takeUntil, filter, tap, delay, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { ExtendedMatDialog } from './../../../../../utils';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { DeputationFormComponent } from './deputation-form.component';
import { DeputationService } from './deputation.service';

@Component({
    templateUrl: './deputation.component.html',
    styleUrls: ['./deputation.component.scss']
})
export class DeputationComponent implements OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    isLoadingResults = true;
    deputations: any[] = [];
    trackById = (_: number, item: any) => item.id;

    constructor(private cdr: ChangeDetectorRef,
                private notify: SnackToastService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
                private deputationService: DeputationService,
    ) { }

    onAction(id: number) {
        let instance: MatDialogRef<DeputationFormComponent, any>;
        const data = this.deputations.find(x => x.id === id);
        instance = this.dialog.open(DeputationFormComponent, {
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
                    const d: any = res;
                    const index = this.deputations.findIndex(x => x.id === d.id);
                    if (index > -1) {
                        this.deputations[index] = d;
                    } else {
                        this.deputations.unshift(d);
                    }
                }))
            .subscribe({
                next: res => [this.notify.when('success', res, this.resetFlags)],
                error: e => [this.notify.when('danger', e, this.resetFlags)]
            });
    }


    private initData() {
        this.cdr.markForCheck();
        this.deputations = [];
        this.isLoadingResults = true;


        this.deputationService.getList()
            .pipe(takeUntil(this.toDestroy$),
                delay(500))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.deputations = (res || []);
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }

    ngAfterViewInit() {
        this.initData();
    }

    resetFlags = () => { this.isLoadingResults = false; };
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.deputationService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.deputations.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.deputations.splice(index, 1);
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
