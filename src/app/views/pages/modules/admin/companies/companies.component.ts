import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { merge, of, Subject } from 'rxjs';
import { debounceTime, delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Companies, Filter, QueryModel } from '../../../../../models';
import { collectionInOut, ExtendedMatDialog, fadeIn, fadeInOutStagger, ParamGenService, RowContentStatus } from '../../../../../utils';

import { CompanyFormComponent } from './company-form.component';
import { CompanyService } from './company.service';
import { ClearCachedCompaniesOnDestroyAction, LoadLazyCompany } from './store/companies.store';
import { SnackToastService, DeleteConfirmComponent } from '../../../../shared';

@Component({
    templateUrl: './companies.component.html',
    styleUrls: ['../../../../shared/shared.scss'],
    animations: [fadeInOutStagger, fadeIn, collectionInOut],
})
export class CompaniesComponent implements AfterViewInit, OnDestroy {

    private readonly toDestroy$ = new Subject<void>();

    displayedColumns = ['details', 'select', 'id', 'name', 'category', 'address', 'status', 'action'];
    dataSource: MatTableDataSource<Companies> = new MatTableDataSource(null);
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<Companies>(true, []);
    expandedElement: Companies | null;

    isLoadingResults = true;

    // request query
    query: QueryModel = { filters: [] };

    hasFilter: boolean = this.paramGen.hasFilter;

    constructor(
        private cService: CompanyService,
        private rowStatus: RowContentStatus,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private notify: SnackToastService,
        private dialogUtil: ExtendedMatDialog,
        private paramGen: ParamGenService,
        private store: Store
    ) { }

    ngAfterViewInit() {

        // init default
        this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
        this.initData();

        // executes when table sort/paginator change happens.
        this.initEvents();

    }

    ngOnDestroy() {
        this.store.dispatch(new ClearCachedCompaniesOnDestroyAction());
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    rowDetailExpand(row: Companies) {
        this.expandedElement = this.expandedElement === row ? null : row;
        this.store.dispatch(new LoadLazyCompany(row.regGuid));
    }

    // E.G. https://netbasal.com/angular-2-improve-performance-with-trackby-cc147b5104e5
    trackById = (_: number, item: Companies) => item.id;

    contentStatus = (s: string) => this.rowStatus.initContentStatusCssClass(s);

    rowHeight(row: Companies) {
        return this.expandedElement === row ? { 'min-height': 'auto' } : { 'min-height': '0', border: '0' };
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    onAction(id: number) {
        let instance: MatDialogRef<CompanyFormComponent, any>;
        instance = this.dialog.open(CompanyFormComponent, {
            width: '1000px',
            maxHeight: '90vh',
            data: { id },
            autoFocus: false,
        });

        this.dialogUtil.animateBackdropClick(instance);

        instance.afterClosed().pipe(
            takeUntil(this.toDestroy$),
            filter(res => res && res.contentBody),
            tap(res => {
                this.cdr.markForCheck();
                const d: Companies = res.contentBody;
                const index = this.dataSource.data.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    this.dataSource.data[index] = d;
                } else {
                    this.dataSource.data.unshift(d);
                }

                this.dataSource._updateChangeSubscription();

            })
        ).subscribe({
            next: res => [this.notify.when('success', res), this.dataSource._updateChangeSubscription()],
            error: e => this.notify.when('danger', e),
            complete: () => this.isLoadingResults = false
        });
    }

    onDelete(id: number) {

        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(
                takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.cService.deleteCompany(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.dataSource.data.findIndex(_ => _.id === id);
                    if (index > -1) {
                        this.dataSource.data.splice(index, 1);
                        // decrease the length of total items
                        this.paginator.length--;
                    }

                    this.notify.when('success', res);
                    this.dataSource._updateChangeSubscription();
                },
                error: e => this.notify.when('danger', e),
                complete: () => this.isLoadingResults = false
            });

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
        const fl: Filter = { ...f, column };
        const index = this.query.filters.findIndex(_ => _.column === column);
        if (index > -1) {
            this.query.filters[index] = fl;
        } else {
            this.query.filters.push(fl);
        }

        this.initData();
    }

    private initData() {
        this.cdr.markForCheck();
        this.dataSource.data = [];
        this.isLoadingResults = true;

        this.cService.getCompanies(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
            this.cdr.markForCheck();
            this.dataSource.data = (res.contentBody.items || []);
            this.paginator.length = (res.contentBody.totalItems || 0);
            this.isLoadingResults = false;
            // this.dataSource._updateChangeSubscription();
            // console.log(this.dataSource.data)
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
            // clear selection
            this.selection.clear();

            // sort event
            if (( event as Sort).active) {
                // reset paginator to default when sort happens
                this.query.paginator = { pageIndex: 1, pageSize: this.paginator.pageSize };
                // const s = event as Sort;
                this.query.sort = { orderBy: this.sort.active, orderDirection: this.sort.direction };
            } else {
                this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
            }

            this.initData();
        });
    }



}
