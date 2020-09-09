import { Component, OnInit, ChangeDetectorRef, ChangeDetectionStrategy, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { TraningDetailsService } from './traning-details.service';
import { ResponseModel } from '../../../../../../../../src/app/models';
import { SnackToastService, DeleteConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { ExtendedMatDialog, fadeInOutStagger } from '../../../../../../../../src/app/utils';
import { TraningDetailsFormComponent } from './traning-details-form.component';

@Component({
    templateUrl: './traning-details.component.html',
    animations: [fadeInOutStagger],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TraningDetailsComponent implements OnInit, OnDestroy {
    traningDetails: any[] = [];

    private toDestroy$ = new Subject<void>();

    // trun on/off loading bar/placeholder when http request being made
    isLoading: boolean;

    constructor(
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private snackBar: SnackToastService,
        private dialogUtil: ExtendedMatDialog,
        private traningDetailsService: TraningDetailsService
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.traningDetailsService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(700))
            .subscribe(_ => [
                this.cdr.markForCheck(),
                this.traningDetails = _,
                this.isLoading = false],
                e => this.onError(e));
    }

    // E.G. https://netbasal.com/angular-2-improve-performance-with-trackby-cc147b5104e5
    trackById = (_: number, item: any) => item.id;


    onAction(id: number) {

        let instance: MatDialogRef<TraningDetailsFormComponent, any>;
        const data = this.traningDetails.find(_ => _.id === id);
        instance = this.dialog.open(TraningDetailsFormComponent, {
            width: '800px',
            data: data ? data : {},
            autoFocus: false,
        });

        instance.afterClosed().pipe(
            takeUntil(this.toDestroy$),
            filter(res => res && res),
            tap(res => {
                this.cdr.markForCheck();
                const d: any = res;
                const index = this.traningDetails.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    this.traningDetails[index] = d;
                } else {
                    this.traningDetails.unshift(d);
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
                switchMap(() => this.traningDetailsService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.traningDetails.findIndex(_ => _.id === id);
                if (index > -1) {
                    this.traningDetails.splice(index, 1);
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
