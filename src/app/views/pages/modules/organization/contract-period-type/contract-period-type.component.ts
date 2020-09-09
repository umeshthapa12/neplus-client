import { QueryModel } from './../../../../../models/filter-sort-pager.model';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil, delay, filter, switchMap, tap, debounceTime } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChild } from '@angular/core';
import { collectionInOut, ExtendedMatDialog } from './../../../../../utils';
import { DeleteConfirmComponent, SnackToastService } from './../../../../shared';
import { ContractPeriodService } from './contract-period.service';
import { ContractPeriodTypeFormComponent } from './contract-period-type-form.component';
import { MatPaginator } from '@angular/material/paginator';

@Component({
    templateUrl: './contract-period-type.component.html',
    styleUrls: ['./contract-period-type.component.scss'],
    animations: [collectionInOut]
})
export class ContractPeriodTypeComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    isLoadingResults: boolean;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    query: QueryModel = { filters: [], sort: {} };
    contracts: any[] = [];
    trackById = (_: number, item: any) => item.id;
    constructor(private contractPeriodService: ContractPeriodService,
                private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private notify: SnackToastService,
                private dialogUtil: ExtendedMatDialog,

    ) { }

    ngOnInit() {
        //   this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<ContractPeriodTypeFormComponent, any>;
        const data = this.contracts.find(x => x.id === id);
        instance = this.dialog.open(ContractPeriodTypeFormComponent, {
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
                    const d: any = res;
                    const index = this.contracts.findIndex(x => x.id === d.id);
                    if (index > -1) {
                        this.contracts[index] = d;
                    } else {
                        this.contracts.unshift(d);
                    }
                })).subscribe({
                    next: res => [this.notify.when('success', res, this.resetFlag)],
                    error: e => [this.notify.when('danger', e, this.resetFlag)]
                });

    }


    private initData() {
        this.cdr.markForCheck();
        this.isLoadingResults = true;
        this.contracts = [];

        this.contractPeriodService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.contracts = (res || []);
                this.paginator.length = (res.length || 0);
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }


    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.contractPeriodService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.contracts.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.contracts.splice(index, 1);
                    }
                    this.notify.when('success', res, this.resetFlag);

                }, error: e => this.notify.when('danger', e, this.resetFlag)
            });

    }

    private initEvents() {
        const obs = [
            this.paginator.page
        ];
        merge(...obs).pipe(
            debounceTime(100),
            takeUntil(this.toDestroy$)
        ).subscribe(event => {
            this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
            this.initData();
        });
    }

    ngAfterViewInit() {
        this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
        this.initData();
        this.initEvents();
    }

    resetFlag = () => { this.isLoadingResults = false; };
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
