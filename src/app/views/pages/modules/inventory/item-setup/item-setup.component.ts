import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SelectionModel } from '@angular/cdk/collections';
import { Subject, of, merge } from 'rxjs';
import { debounceTime, takeUntil, filter, switchMap, tap, delay } from 'rxjs/operators';
import {
    collectionInOut, fadeIn, ParamGenService, ExtendedMatDialog, CustomAnimationPlayer
} from '../../../../../../../src/app/utils';
import { QueryModel, ResponseModel, Filter } from '../../../../../../../src/app/models';
import {
    SnackToastService, SnackbarModel, AlertTypeClass, AlertType, DeleteConfirmComponent
} from '../../../../../../../src/app/views/shared';
import { ItemSetupService } from './item-setup.service';
import { ItemSetupFormComponent } from './item-setup-form.component';


@Component({
    templateUrl: './item-setup.component.html',
    animations: [collectionInOut, fadeIn],
    styleUrls: ['./item-setup.scss']
})
export class ItemSetupComponent implements OnInit, OnDestroy {

    private readonly toDestroy$ = new Subject<void>();

    displayedColumns = ['select', 'id', 'itemCode', 'itemName', 'groupName', 'unitName', 'purchaseRate',
        'minStockQty', 'remarks', 'action'];

    dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<any>(true, []);

    isLoadingResults = true;

    query: QueryModel = { filters: [] };

    hasFilter: boolean = this.paramGen.hasFilter;

    options: string = 'All';

    constructor(
        private cdr: ChangeDetectorRef,
        private paramGen: ParamGenService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
        private snackBar: SnackToastService,
        private isService: ItemSetupService,
        private cap: CustomAnimationPlayer
    ) { }

    ngOnInit() { }

    filters(e) {
        this.options = e;
        let allValue: any[];
        this.isService.getList().subscribe({
            next: res => {
                allValue = res;
            }
        });

        if (this.options === 'All') {
            this.dataSource.data = allValue.reverse();
            this.paginator.length = allValue.length;
        } else if (this.options === 'Today') {
            const today = allValue.slice(2, 3);
            this.dataSource.data = today.reverse();
            this.paginator.length = today.length;
        } else if (this.options === 'Yesterday') {
            const yesterday = allValue.slice(1, 2);
            this.dataSource.data = yesterday;
            this.paginator.length = yesterday.length;
        } else if (this.options === 'Last 7 days') {
            const days = allValue.slice(2, 4);
            this.dataSource.data = days;
            this.paginator.length = days.length;
        } else if (this.options === 'Last 30 days') {
            const days = allValue.splice(0, 4);
            this.dataSource.data = days;
            this.paginator.length = days.length;
        } else if (this.options === 'Last 3 months') {
            const m = allValue.slice(0, 4);
            this.dataSource.data = m.reverse();
            this.paginator.length = m.length;
        } else if (this.options === 'Last 6 months') {
            const months = allValue.slice(0, 4);
            this.dataSource.data = months;
            this.paginator.length = months.length;
        } else if (this.options === 'Custom range') {
            const c = [];
            this.dataSource.data = c;
            this.paginator.length = c.length;
        }
    }

    trackById = (_: number, item: any) => item.id;

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
        let instance: MatDialogRef<ItemSetupFormComponent, any>;
        // let instance: MatDialogRef<DartaFormComponent, ResponseModel>;
        const data = this.dataSource.data.find(_ => _.id === id);
        instance = this.dialog.open(ItemSetupFormComponent, {
            width: '900px',
            data: data ? data : {},
            autoFocus: false,
        });

        this.dialogUtil.animateBackdropClick(instance);

        instance.afterClosed().pipe(
            takeUntil(this.toDestroy$),
            // filter(res => res && res.contentBody),
            filter(res => res),
            tap(res => {
                this.cdr.markForCheck();
                // const d: any = res.contentBody;
                const d: any = res;
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
        ).subscribe(res => [
            this.onSuccess(res),
            this.dataSource._updateChangeSubscription(),
        ], e => this.onError(e));
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

        // this.isService.getItemSetup(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
        //     this.cdr.markForCheck();
        //     this.dataSource.data = (res.contentBody.items || []);
        //     this.paginator.length = (res.contentBody.totalItems || 0);
        //     this.isLoadingResults = false;
        //     // this.dataSource._updateChangeSubscription();
        //     // console.log(this.dataSource.data)
        // }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);

        this.isService.getList().pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
            this.cdr.markForCheck();
            this.dataSource.data = (res || []);
            this.paginator.length = (res.length || 0);
            this.isLoadingResults = false;
            // this.dataSource._updateChangeSubscription();
            // console.log(this.dataSource.data)
        }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }

    onDelete(id: number) {

        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(
                takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.isService.deleteList(id)
                    .pipe(takeUntil(this.toDestroy$)))
                // for real data
                // switchMap(() => this.isService.deleteItemSetup(id)
                //     .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.dataSource.data.findIndex(_ => _.id === id);
                if (index > -1) {
                    this.dataSource.data.splice(index, 1);
                    // decrease the length of total items
                    this.paginator.length--;
                }

                this.onSuccess(res);
                this.dataSource._updateChangeSubscription();
            }, e => this.onError(e));

    }

    deleteSelected() {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed().pipe(takeUntil(this.toDestroy$), filter(_ => _)).subscribe(_ => {
            this.selection.selected.forEach(item => {
                let data = this.dataSource.data;
                let index: number = data.findIndex(d => d === item);
                console.log(data.findIndex(d => d === item));
                this.dataSource.data.splice(index, 1);
                this.selection.clear();
                this.dataSource._updateChangeSubscription();
            });
            this.onSuccess(_);

            // this.purchaseRecordService.deleteSelected(this.selection.selected)
            //     .subscribe(_ => {
            //         console.log(_);
            //         this.dataSource.data = _;
            //         this.selection.clear();
            //         this.dataSource._updateChangeSubscription();
            //         this.onSuccess(_);
            //     });
        }, e => this.onError(e));
    }

    ngAfterViewInit() {
        // init default
        this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
        this.initData();

        // executes when table sort/paginator change happens.
        this.initEvents();
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
            if ((event as Sort).active) {
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

    private onSuccess(res: ResponseModel) {

        this.cdr.markForCheck();
        const config: SnackbarModel = {
            title: 'Success',
            typeClass: AlertTypeClass.success,
            message: (res.messageBody || 'Success'),
            type: AlertType.success
        };
        // init snackbar
        this.snackBar.initSnakbar(config);

        this.resetFlags();

    }

    private resetFlags() {
        this.isLoadingResults = false;
    }

    private onError(ex: any) {

        this.cdr.markForCheck();

        /* handle error*/
        const c: SnackbarModel = {
            title: (ex.statusText || 'Error'),
            type: AlertType.Danger,
            typeClass: AlertTypeClass.Danger,
            message: (ex.error && ex.error.messageBody || 'Something went wrong.')
        };

        this.snackBar.initSnakbar(c);

        this.resetFlags();

    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
