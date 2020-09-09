import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from './../../../../../models';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog, fadeInOutStagger } from './../../../../../utils';
import { PreviousEmploymentDetailService } from './previous-employment-detail.service';
import { PreviousEmploymentDetailFormComponent } from './previous-employment-detail-form.component';


@Component({
    templateUrl: './previous-employement-detail.component.html',
    styleUrls: ['./previous-employement-detail.component.scss'],
    animations: [fadeInOutStagger]
})
export class PreviousEmployementDetailComponent implements OnInit, OnDestroy {
    constructor(
        private cdr: ChangeDetectorRef,
        private previousService: PreviousEmploymentDetailService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
        private snackBar: SnackToastService,
    ) { }
    private readonly toDestroy$ = new Subject<void>();
    previousEmployment: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    ngOnInit() {
        this.initData();
    }
    onAction(id: number) {
        let instance: MatDialogRef<PreviousEmploymentDetailFormComponent, any>;
        const data = this.previousEmployment.find(x => x.id === id);
        instance = this.dialog.open(PreviousEmploymentDetailFormComponent, {
            width: '500px',
            data: data ? data : {},
            autoFocus: false,
        });
        this.dialogUtil.animateBackdropClick(instance);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(res => res && res),
                tap(res => {
                    console.log(res);
                    this.cdr.markForCheck();
                    const p: any = res;
                    const index = this.previousEmployment.findIndex(x => x.id === p.id);
                    if (index > -1) {
                        this.previousEmployment[index] = p;
                    } else {
                        this.previousEmployment.unshift(p);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initData() {
        this.cdr.markForCheck();
        this.previousEmployment = [];
        this.isLoading = true;

        this.previousService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.previousEmployment = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
    }
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.previousService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.previousEmployment.findIndex(x => x.id === id);
                if (index > -1) {
                    this.previousEmployment.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
    }
    onSuccess(res: ResponseModel) {
        this.cdr.markForCheck();
        this.snackBar.when('success', res);
        this.isLoading = false;
    }

    onError(e: any) {
        this.cdr.markForCheck();
        this.snackBar.when('danger', e);
        this.isLoading = false;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
