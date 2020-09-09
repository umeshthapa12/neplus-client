import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { ResponseModel } from '../../../../../../../../src/app/models';
import { SnackToastService, DeleteConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { PunishmentFormComponent } from './punishment-details-form.component';
import { ExtendedMatDialog, fadeInOutStagger } from '../../../../../../../../src/app/utils';
import { PunishmentService } from './punishment.service';

@Component({
    templateUrl: './punishment-details.component.html',
    animations: [fadeInOutStagger]
})
export class PunishmentComponent implements OnInit, OnDestroy {
    punishmentDetails: any[] = [];

    private toDestroy$ = new Subject<void>();

    // trun on/off loading bar/placeholder when http request being made
    isLoading: boolean;

    constructor(
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private snackBar: SnackToastService,
        private dialogUtil: ExtendedMatDialog,
        private punishmentService: PunishmentService
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.punishmentService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(700))
            .subscribe(_ => [
                this.cdr.markForCheck(),
                this.punishmentDetails = _,
                this.isLoading = false],
                e => this.onError(e));
    }

    // E.G. https://netbasal.com/angular-2-improve-performance-with-trackby-cc147b5104e5
    trackById = (_: number, item: any) => item.id;


    onAction(id: number) {

        let instance: MatDialogRef<PunishmentFormComponent, any>;
        const data = this.punishmentDetails.find(_ => _.id === id);
        instance = this.dialog.open(PunishmentFormComponent, {
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
                const index = this.punishmentDetails.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    this.punishmentDetails[index] = d;
                } else {
                    this.punishmentDetails.unshift(d);
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
                switchMap(() => this.punishmentService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.punishmentDetails.findIndex(_ => _.id === id);
                if (index > -1) {
                    this.punishmentDetails.splice(index, 1);
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
