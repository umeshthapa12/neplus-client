import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmComponent, SnackToastService } from './../../../../shared';
import { ResponseModel } from './../../../../../models';
import { ExtendedMatDialog, fadeInOutStagger } from './../../../../../utils';
import { RetirementInformationFormComponent } from './retirement-information-form.component';
import { RetirementInformationService } from './retirement-information.service';

@Component({
    templateUrl: './retirement-information.component.html',
    styleUrls: ['./retirement-information.component.scss'],
    animations: [fadeInOutStagger]
})
export class RetirementInformationComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    retirements: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    constructor(private cdr: ChangeDetectorRef,
                private snackbar: SnackToastService,
                private retirementService: RetirementInformationService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,

    ) { }

    ngOnInit() {
        this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<RetirementInformationFormComponent, any>;
        const data = this.retirements.find(x => x.id === id);
        instance = this.dialog.open(RetirementInformationFormComponent, {
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
                    const r: any = res;
                    const index = this.retirements.findIndex(x => x.id === r.id);
                    if (index > -1) {
                        this.retirements[index] = r;
                    } else {
                        this.retirements.unshift(r);
                    }
                })).subscribe({
                    next: res => this.onSuccess(res),
                    error: e => this.onError(e)
                });

    }

    private initData() {
        this.cdr.markForCheck();
        this.retirements = [];
        this.isLoading = true;

        this.retirementService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.retirements = (res || []);
                this.isLoading = false;
            });

    }

    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.retirementService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.retirements.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.retirements.splice(index, 1);
                    }
                    this.onSuccess(res);
                }, error: e => this.onError(e)
            });
    }

    private onSuccess(res: ResponseModel) {
        this.cdr.markForCheck();
        this.snackbar.when('success', res);
        this.isLoading = false;
    }

    private onError(e: any) {
        this.cdr.markForCheck();
        this.snackbar.when('danger', e);
        this.isLoading = false;
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
