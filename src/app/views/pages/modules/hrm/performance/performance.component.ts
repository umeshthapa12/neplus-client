import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from './../../../../../models';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog, fadeInOutStagger } from './../../../../../utils';
import { PerformanceFormComponent } from './performance-form.component';
import { PerformanceService } from './performance.service';

@Component({
    templateUrl: './performance.component.html',
    styleUrls: ['./performance.component.scss'],
    animations: [fadeInOutStagger]
})
export class PerformanceComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    performances: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;
    constructor(private cdr: ChangeDetectorRef,
                private performanceService: PerformanceService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
                private snackBar: SnackToastService,

    ) { }

    ngOnInit() {
        this.initData();
    }
    onAction(id: number) {
        let instance: MatDialogRef<PerformanceFormComponent, any>;
        const data = this.performances.find(x => x.id === id);
        instance = this.dialog.open(PerformanceFormComponent, {
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
                    const p: any = res;
                    const index = this.performances.findIndex(x => x.id === p.id);
                    if (index > -1) {
                        this.performances[index] = p;
                    } else {
                        this.performances.unshift(p);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initData() {
        this.cdr.markForCheck();
        this.performances = [];
        this.isLoading = true;

        this.performanceService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.performances = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
    }
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.performanceService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.performances.findIndex(x => x.id === id);
                if (index > -1) {
                    this.performances.splice(index, 1);
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
        this.isLoading = true;
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
