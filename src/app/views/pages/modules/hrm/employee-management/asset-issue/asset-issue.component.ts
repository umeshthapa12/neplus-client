import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AssetIssueService } from './asset-issue.service';
import { AssetIssueFormComponent } from './asset-issue-form.component';
import { ResponseModel } from '../../../../../../../../src/app/models';
import { fadeInOutStagger, ExtendedMatDialog } from '../../../../../../../../src/app/utils';
import { SnackToastService, DeleteConfirmComponent } from '../../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './asset-issue.component.html',
    styleUrls: [],
    animations: [fadeInOutStagger]
})
export class AssetIssueComponent implements OnInit, OnDestroy {
    assetIssues: any[] = [];

    private toDestroy$ = new Subject<void>();

    // trun on/off loading bar/placeholder when http request being made
    isLoading: boolean;

    constructor(
        private dialog: MatDialog,
        private cdr: ChangeDetectorRef,
        private snackBar: SnackToastService,
        private dialogUtil: ExtendedMatDialog,
        private assetIssueService: AssetIssueService
    ) { }

    ngOnInit() {
        this.isLoading = true;
        this.assetIssueService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(700))
            .subscribe(_ => [
                this.cdr.markForCheck(),
                this.assetIssues = _,
                this.isLoading = false],
                e => this.onError(e));
    }

    // E.G. https://netbasal.com/angular-2-improve-performance-with-trackby-cc147b5104e5
    trackById = (_: number, item: any) => item.id;


    onAction(id: number) {

        let instance: MatDialogRef<AssetIssueFormComponent, any>;
        const data = this.assetIssues.find(_ => _.id === id);
        instance = this.dialog.open(AssetIssueFormComponent, {
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
                const index = this.assetIssues.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    this.assetIssues[index] = d;
                } else {
                    this.assetIssues.unshift(d);
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
                switchMap(() => this.assetIssueService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.assetIssues.findIndex(_ => _.id === id);
                if (index > -1) {
                    this.assetIssues.splice(index, 1);
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
