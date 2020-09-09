import { Component, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit, AfterContentChecked } from '@angular/core';
import { Subject, of, merge } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import { DartaFormComponent } from './darta-form.component';
import { takeUntil, filter, tap, debounceTime, delay, switchMap } from 'rxjs/operators';
import { DartaService } from './darta.service';
import {
    collectionInOut, fadeIn, ParamGenService, ExtendedMatDialog, CustomAnimationPlayer
} from '../../../../../../../src/app/utils';
import { QueryModel, Filter, ResponseModel } from '../../../../../../../src/app/models';
import {
    SnackToastService, DeleteConfirmComponent, SnackbarModel, AlertTypeClass, AlertType
} from '../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './darta.component.html',
    animations: [collectionInOut, fadeIn],
    styleUrls: ['./darta.scss']
})
export class DartaComponent implements AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    displayedColumns = ['select', 'id', 'regNo', 'noOfLetter', 'subject', 'letterKind', 'senderOfficeName', 'branch', 'action'];

    dataSource: MatTableDataSource<any> = new MatTableDataSource(null);
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<any>(true, []);

    isLoadingResults = true;

    option = 'कार्यालयहरु';
    options = 'All';

    // request query
    query: QueryModel = { filters: [] };

    hasFilter: boolean = this.paramGen.hasFilter;

    constructor(
        private cdr: ChangeDetectorRef,
        private paramGen: ParamGenService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
        private snackBar: SnackToastService,
        private dService: DartaService,
        private cap: CustomAnimationPlayer
    ) { }

    filteredOption(v: string) {
        this.option = v;

        if (this.option === 'कार्यालयहरु') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    this.dataSource.data = res;
                    this.paginator.length = res.length;
                    this.isLoadingResults = false;
                }
            });

        } else if (this.option === 'वडा न 1') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(3, 13).reverse();
                    this.dataSource.data = d;
                    const l = res.slice(3, 10);
                    this.paginator.length = l.length;
                    this.dataSource._updateChangeSubscription();
                }
            });

        } else if (this.option === 'वडा न 2') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(0, 9).reverse();
                    this.dataSource.data = d;
                    const l = res.slice(2, 11);
                    this.paginator.length = l.length;
                    this.dataSource._updateChangeSubscription();
                }
            });

        } else if (this.option === 'वडा न 3') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(9, 21);
                    this.dataSource.data = d;
                    this.paginator.length = (d.length || 0);
                    this.dataSource._updateChangeSubscription();
                }
            });
        } else if (this.option === 'वडा न 4') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(11, 18).reverse();
                    this.dataSource.data = d;
                    const l = res.slice(6, 11);
                    this.paginator.length = (l.length || 0);
                    this.dataSource._updateChangeSubscription();
                }
            });
        } else if (this.option === 'वडा न 5') {
            this.dService.getList().pipe(delay(600)).subscribe({
                next: res => {
                    const d = res.slice(9, 20);
                    this.dataSource.data = d;
                    this.paginator.length = d.length;
                }
            });

        }
    }

    filters(e: number) {
        let totalList: any[];
        this.dService.getList().subscribe({
            next: res => {
                totalList = res;
            }
        });
        if (e === 0) {
            this.options = 'All';
            this.dataSource.data = totalList;
            this.paginator.length = totalList.length;
        } else if (e === 1) {
            this.options = 'Today';
            const data = totalList;
            const d = data.slice(0, 2);
            this.dataSource.data = d.reverse();
            this.paginator.length = d.length;
        } else if (e === 2) {
            this.options = 'Yesterday';
            const data = totalList;
            const d = data.slice(0, 4);
            this.dataSource.data = data.slice(0, 4).reverse();
            this.paginator.length = d.length;
        } else if (e === 3) {
            this.options = 'Last 7 Days';
            const data = totalList;
            const d = data.slice(0, 4);
            this.dataSource.data = d.slice(0, 5);
            this.paginator.length = d.length;
        } else if (e === 4) {
            this.options = 'Last 30 Days';
            const data = totalList;
            const d = data.slice(0, 6);
            this.dataSource.data = data.slice(0, 6).reverse();
            this.paginator.length = d.length;
        } else if (e === 5) {
            this.options = 'Last 3 Months';
            const data = totalList;
            const d = data.slice(9, 19);
            this.dataSource.data = d.reverse();
            this.paginator.length = d.length;
        } else if (e === 6) {
            this.options = 'Last 6 Months';
            const data = totalList;
            const d = data.slice(5, 18);
            this.dataSource.data = d;
            this.paginator.length = d.length;
        } else if (e === 8) {
            this.options = 'Custom Range';
            const data = totalList;
            const d = data.slice(0, 0);
            this.dataSource.data = d;
            this.paginator.length = d.length;
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
        let instance: MatDialogRef<DartaFormComponent, any>;
        // let instance: MatDialogRef<DartaFormComponent, ResponseModel>;
        const data = this.dataSource.data.find(_ => _.id === id);
        instance = this.dialog.open(DartaFormComponent, {
            width: '900px',
            data: data ? data : {},
            autoFocus: false,
        });

        this.dialogUtil.animateBackdropClick(instance);

        instance.afterClosed().pipe(
            takeUntil(this.toDestroy$),
            // filter(res => res && res.contentBody),
            filter(res => res && res),
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

        // this.dService.getDarta(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
        //     this.cdr.markForCheck();
        //     this.dataSource.data = (res.contentBody.items || []);
        //     this.paginator.length = (res.contentBody.totalItems || 0);
        //     this.isLoadingResults = false;
        //     // this.dataSource._updateChangeSubscription();
        //     // console.log(this.dataSource.data)
        // }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);

        this.dService.getList().pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
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
                switchMap(() => this.dService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
                // for real data
                // switchMap(() => this.dService.deleteDarta(id)
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
