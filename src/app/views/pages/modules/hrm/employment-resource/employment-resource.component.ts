import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { delay, takeUntil, filter, tap, switchMap } from 'rxjs/operators';
import { EmploymentResourceFormComponent } from './employment-resource-form.component';
import { ResponseModel } from '../../../../../../../src/app/models';
import { fadeInOutStagger, ExtendedMatDialog } from '../../../../../../../src/app/utils';
import { EmploymentResourceService } from './employment-resource.service';
import { SnackToastService, DeleteConfirmComponent } from '../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './employment-resource.component.html',
    styleUrls: [],
    animations: [fadeInOutStagger]
})
export class EmploymentResourceComponent implements OnInit, OnDestroy {
    employmentResources: any[] = [];

    private toDestroy$ = new Subject<void>();

    // trun on/off loading bar/placeholder when http request being made
    isLoading: boolean;

    constructor(
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private snackBar: SnackToastService,
        private dialogUtil: ExtendedMatDialog,
        private employmentResourceService: EmploymentResourceService
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.employmentResourceService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(700))
            .subscribe(_ => [
                this.cdr.markForCheck(),
                this.employmentResources = _,
                this.isLoading = false],
                e => this.onError(e));
    }

    // E.G. https://netbasal.com/angular-2-improve-performance-with-trackby-cc147b5104e5
    trackById = (_: number, item: any) => item.id;


    onAction(id: number) {

        let instance: MatDialogRef<EmploymentResourceFormComponent, any>;
        const data = this.employmentResources.find(_ => _.id === id);
        instance = this.dialog.open(EmploymentResourceFormComponent, {
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
                const index = this.employmentResources.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    this.employmentResources[index] = d;
                } else {
                    this.employmentResources.unshift(d);
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
                switchMap(() => this.employmentResourceService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.employmentResources.findIndex(_ => _.id === id);
                if (index > -1) {
                    this.employmentResources.splice(index, 1);
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
