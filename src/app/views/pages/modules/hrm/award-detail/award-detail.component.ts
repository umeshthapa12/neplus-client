import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fadeInOutStagger, ExtendedMatDialog } from './../../../../../utils';
import { ResponseModel } from './../../../../../models';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { AwardDetailService } from './award-detail.service';
import { AwardDetailFormComponent } from './award-detail-form.component';

@Component({
    templateUrl: './award-detail.component.html',
    styleUrls: ['./award-detail.component.scss'],
    animations: [fadeInOutStagger]
})
export class AwardDetailComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    awardDetails: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;
    constructor(private cdr: ChangeDetectorRef,
                private awardDetailService: AwardDetailService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
                private snackBar: SnackToastService,
    ) { }

    ngOnInit() {
        this.initData();
    }
    onAction(id: number) {
        let instance: MatDialogRef<AwardDetailFormComponent, any>;
        const data = this.awardDetails.find(x => x.id === id);
        instance = this.dialog.open(AwardDetailFormComponent, {
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
                    const a: any = res;
                    const index = this.awardDetails.findIndex(x => x.id === a.id);
                    if (index > -1) {
                        this.awardDetails[index] = a;
                    } else {
                        this.awardDetails.unshift(a);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initData() {
        this.cdr.markForCheck();
        this.awardDetails = [];
        this.isLoading = true;

        this.awardDetailService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(500))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.awardDetails = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
    }

    private onSuccess(res: ResponseModel) {
        this.cdr.markForCheck();
        this.snackBar.when('success', res);
        this.isLoading = false;
    }

    private onError(e: any) {
        this.cdr.markForCheck();
        this.snackBar.when('danger', e);
        this.isLoading = false;
    }

    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.awardDetailService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.awardDetails.findIndex(x => x.id === id);
                if (index > -1) {
                    this.awardDetails.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
