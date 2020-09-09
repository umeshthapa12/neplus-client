import { takeUntil, delay, filter, switchMap, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ResponseModel } from '../../../../../models';
import { fadeInOutStagger, ExtendedMatDialog } from './../../../../../utils';
import { ServiceInformationService } from './service-information.service';
import { ServiceInformationFormComponent } from './service-information-form.component';

@Component({
    templateUrl: './service-information.component.html',
    styleUrls: ['./service-information.component.scss'],
    animations: [fadeInOutStagger]
})
export class ServiceInformationComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    serviceInformations: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    constructor(
        private cdr: ChangeDetectorRef,
        private serviceInformationService: ServiceInformationService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
        private snackBar: SnackToastService,
    ) { }

    ngOnInit() {
        this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<ServiceInformationFormComponent, any>;
        const data = this.serviceInformations.find(x => x.id === id);
        instance = this.dialog.open(ServiceInformationFormComponent, {
            width: '800px',
            data: data ? data : {},
            autoFocus: false,
        });
        this.dialogUtil.animateBackdropClick(instance);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(res => res && res),
                tap(res => {
                    this.cdr.markForCheck();
                    const s: any = res;
                    const index = this.serviceInformations.findIndex(x => x.id === s.id);
                    if (index > -1) {
                        this.serviceInformations[index] = s;
                    } else {
                        this.serviceInformations.unshift(s);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }
    private initData() {
        this.cdr.markForCheck();
        this.serviceInformations = [];
        this.isLoading = true;

        this.serviceInformationService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.serviceInformations = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
    }
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.serviceInformationService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.serviceInformations.findIndex(x => x.id === id);
                if (index > -1) {
                    this.serviceInformations.splice(index, 1);
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
        this.isLoading = false;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
