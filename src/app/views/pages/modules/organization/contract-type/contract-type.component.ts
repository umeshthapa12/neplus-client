import { QueryModel } from './../../../../../models/filter-sort-pager.model';
import { query } from '@angular/animations';
import { MatPaginator } from '@angular/material/paginator';
import { takeUntil, delay, filter, tap, switchMap, debounceTime } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChild, AfterViewInit } from '@angular/core';
import { ExtendedMatDialog, collectionInOut } from './../../../../../utils';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ContractTypeService } from './contract-type.service';
import { ContractTypeFormComponent } from './contract-type-form.component';

@Component({
    templateUrl: './contract-type.component.html',
    animations: [collectionInOut],
    styleUrls: ['./contract-type.component.scss']
})
export class ContractTypeComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    isLoadingResults: boolean;
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    contracts: any[] = [];
    trackById: number;
    query: QueryModel = { filters: [], sort: {} };

    constructor(private contactTypaService: ContractTypeService,
                private dialog: MatDialog,
                private cdr: ChangeDetectorRef,
                private notify: SnackToastService,
                private dialogUtil: ExtendedMatDialog,
    ) { }

    ngOnInit() {
        //   this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<ContractTypeFormComponent, any>;
        const data = this.contracts.find(x => x.id === id);
        instance = this.dialog.open(ContractTypeFormComponent, {
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

    resetFlag = () => { this.isLoadingResults = false; };
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.contactTypaService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.contracts.findIndex(x => x.id === id);
                    if (index > 0) {
                        this.contracts.splice(index, 1);
                    }
                    this.notify.when('success', res, this.resetFlag);
                }, error: e => this.notify.when('danger', e, this.resetFlag)
            });
    }
    private initData() {
        this.cdr.markForCheck();
        this.isLoadingResults = true;
        this.contracts = [];

        this.contactTypaService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.contracts = (res || {});
                this.paginator.length = (res.length || 0);
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
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


    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
