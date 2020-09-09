import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ResponseModel } from '../../../../../../models';
import { SnackToastService, DeleteConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { ExtendedMatDialog, fadeInOutStagger } from '../../../../../../../../src/app/utils';
import { TravelDetailsFormComponent } from './travel-details-form.component';
import { TravelDetailsService } from './travel-details.service';

@Component({
    templateUrl: './travel-details.component.html',
    animations: [fadeInOutStagger],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TravelDetailsComponent implements OnInit, OnDestroy {

    travelDetails: any[] = [];

    private toDestroy$ = new Subject<void>();

    // trun on/off loading bar/placeholder when http request being made
    isLoading: boolean;

    constructor(
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private snackBar: SnackToastService,
        private dialogUtil: ExtendedMatDialog,
        private travelDetailsService: TravelDetailsService
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.travelDetailsService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(700))
            .subscribe(_ => [
                this.cdr.markForCheck(),
                this.travelDetails = _,
                this.isLoading = false],
                e => this.onError(e));
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    // E.G. https://netbasal.com/angular-2-improve-performance-with-trackby-cc147b5104e5
    trackById = (_: number, item: any) => item.id;


    onAction(id: number) {

        let instance: MatDialogRef<TravelDetailsFormComponent, any>;
        const data = this.travelDetails.find(_ => _.id === id);
        instance = this.dialog.open(TravelDetailsFormComponent, {
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
                const index = this.travelDetails.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    this.travelDetails[index] = d;
                } else {
                    this.travelDetails.unshift(d);
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
                switchMap(() => this.travelDetailsService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.travelDetails.findIndex(_ => _.id === id);
                if (index > -1) {
                    this.travelDetails.splice(index, 1);
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
}
