import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subject, merge, of } from 'rxjs';
import { BranchFormComponent } from './branch-form.component';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { debounceTime, takeUntil, filter, switchMap, delay, tap } from 'rxjs/operators';
import { BranchService } from './branch.service';
import {
    fadeIn, fadeInOutStagger, collectionInOut, ParamGenService, ExtendedMatDialog, CustomAnimationPlayer
} from '../../../../../../../src/app/utils';
import { QueryModel, ResponseModel, Filter } from '../../../../../../../src/app/models';
import { SnackToastService, DeleteConfirmComponent } from '../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './branch.component.html',
    animations: [fadeIn, fadeInOutStagger, collectionInOut],
    styleUrls: ['./branch.scss'],
})
export class BranchComponent implements AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    displayedColumns = ['select', 'id', 'name', 'action'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<any>(true, []);

    isLoadingResults = true;
    query: QueryModel = { filters: [] };
    hasFilter: boolean = this.paramGen.hasFilter;
    selectedId: number;

    constructor(
        private cdr: ChangeDetectorRef,
        private paramGen: ParamGenService,
        private dialog: MatDialog,
        private bService: BranchService,
        private notify: SnackToastService,
        private dialogUtil: ExtendedMatDialog,
        private cap: CustomAnimationPlayer
    ) { }

    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    trackById = (_: number, item: any) => item.id;

    onAction(id: number) {
        let instance: MatDialogRef<BranchFormComponent, ResponseModel>;
        const data = this.dataSource.data.find(_ => _.id === id);
        instance = this.dialog.open(BranchFormComponent, {
            width: '650px',
            data: data ? data : {},
            autoFocus: false,
        });

        this.dialogUtil.animateBackdropClick(instance);

        instance.afterClosed().pipe(
            takeUntil(this.toDestroy$),
            filter(res => res && res.contentBody),
            tap(res => {
                this.cdr.markForCheck();
                const d: any = res.contentBody;
                const index = this.dataSource.data.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    d.sn = this.dataSource.data[index].sn;
                    this.dataSource.data[index] = d;
                    this.cap.animate('flash', document.querySelector(`#row${id}`), 900);
                } else {
                    this.dataSource.data.unshift(d);
                }

                this.dataSource._updateChangeSubscription();

            }),
        ).subscribe({
            next: res => [this.notify.when('success', res, this.resetFlags)],
            error: e => this.notify.when('danger', e, this.resetFlags)
        });
    }

    private initData() {
        this.cdr.markForCheck();
        this.dataSource.data = [];
        this.isLoadingResults = true;

        // this.fyService.getFiscalYears(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
        //     this.cdr.markForCheck();
        //     this.dataSource.data = (res.contentBody.items || []);
        //     this.paginator.length = (res.contentBody.totalItems || 0);
        //     this.isLoadingResults = false;

        // }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);

        this.bService.getList().pipe(takeUntil(this.toDestroy$), delay(1000)).subscribe(res => {
            this.cdr.markForCheck();
            this.dataSource.data = (res);
            this.paginator.length = (res.length);
            this.isLoadingResults = false;

        }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }

    private initEvents() {
        const obs = [
            this.sort ? this.sort.sortChange : of(),
            this.paginator.page
        ];
        merge(...obs).pipe(
            debounceTime(100),
            takeUntil(this.toDestroy$)
        ).subscribe(event => {
            this.selection.clear();

            if ((<Sort>event).active) {
                this.query.paginator = { pageIndex: 1, pageSize: this.paginator.pageSize };
                this.query.sort = { orderBy: this.sort.active, orderDirection: this.sort.direction };
            } else {
                this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
            }

            this.initData();
        });
    }

    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(
                takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.bService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.dataSource.data.findIndex(_ => _.id === id);
                    if (index > -1) {
                        this.dataSource.data.splice(index, 1);
                        this.paginator.length--;
                    }

                    this.notify.when('success', res, () => this.resetFlags);
                    this.dataSource._updateChangeSubscription();
                },
                error: e => this.notify.when('danger', e, () => this.resetFlags)
            });
    }

    ngAfterViewInit() {
        this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
        this.initData();
        this.initEvents();
    }

    private resetFlags() {
        this.isLoadingResults = false;
    }

    resetFilters() {
        this.cdr.markForCheck();
        if (this.sort) {
            this.sort.active = null;
            this.sort.direction = null;
        }
        this.query = { filters: [], sort: null };
        this.paramGen.clearParams();
        this.hasFilter = false;

        setTimeout(() => {
            this.initData();
        }, 200);
        this.dataSource._updateChangeSubscription();
    }

    filter(f: Filter, column: string) {
        const fl: Filter = { ...f, column: column };
        const index = this.query.filters.findIndex(_ => _.column === column);
        if (index > -1) {
            this.query.filters[index] = fl;
        } else {
            this.query.filters.push(fl);
        }

        this.initData();
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
