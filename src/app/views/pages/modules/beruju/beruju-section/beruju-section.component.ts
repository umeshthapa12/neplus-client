import { Component, AfterViewInit, OnDestroy, ViewChild, ChangeDetectorRef } from '@angular/core';
import { Subject, of, merge } from 'rxjs';
import { debounceTime, takeUntil, filter, switchMap, tap, delay } from 'rxjs/operators';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { QueryModel, Filter } from '../../../../../../../src/app/models';
import { SnackToastService, DeleteConfirmComponent } from '../../../../../../../src/app/views/shared';
import { BerujuSectionService } from './beruju-section.service';
import { BerujuSectionFormComponent } from './beruju-section-form.component';
import {
    fadeIn, fadeInOutStagger, collectionInOut, ParamGenService, ExtendedMatDialog, CustomAnimationPlayer
} from '../../../../../../../src/app/utils';

@Component({
    templateUrl: './beruju-section.component.html',
    animations: [fadeIn, fadeInOutStagger, collectionInOut],
    styleUrls: ['./beruju-section.scss']
})
export class BerujuSectionComponent implements AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    displayedColumns = ['select', 'id', 'sectionNo', 'title', 'content', 'status', 'action'];

    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<any>(true, []);
    expandedElement: any | null;

    isLoadingResults = true;
    query: QueryModel = { filters: [] };
    hasFilter: boolean = this.paramGen.hasFilter;
    selectedId: number;

    constructor(
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private bsService: BerujuSectionService,
        private paramGen: ParamGenService,
        private dialogUtil: ExtendedMatDialog,
        private cap: CustomAnimationPlayer,
        private notify: SnackToastService,
    ) { }

    trackById = (_: number, item: any) => item.id;

    rowHeight(row: any) {
        return this.expandedElement === row ? { 'min-height': 'auto' } : { 'min-height': '0', border: '0' };
    }

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

    onAction(id: number) {
        // let instance: MatDialogRef<BerujuSectionFormComponent, ResponseModel>;
        let instance: MatDialogRef<BerujuSectionFormComponent, any>;
        const data = this.dataSource.data.find(_ => _.id === id);
        instance = this.dialog.open(BerujuSectionFormComponent, {
            width: '650px',
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
        ).subscribe({
            next: res => [this.notify.when('success', res, this.resetFlags)],
            error: e => this.notify.when('danger', e, this.resetFlags)
        });
    }

    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(
                takeUntil(this.toDestroy$),
                filter(yes => yes),
                // switchMap(() => this.bsService.deleteBerujuSection(id)
                //     .pipe(takeUntil(this.toDestroy$)))
                switchMap(() => this.bsService.deleteList(id)
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

    private initData() {
        this.cdr.markForCheck();
        this.dataSource.data = [];
        this.isLoadingResults = true;

        // this.bsService.getBerujuSection(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
        //     this.cdr.markForCheck();
        //     this.dataSource.data = (res.contentBody.items || []);
        //     this.paginator.length = (res.contentBody.totalItems || 0);
        //     this.isLoadingResults = false;

        // }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);

        this.bsService.getList().pipe(takeUntil(this.toDestroy$), delay(1000)).subscribe(res => {
            this.cdr.markForCheck();
            console.log(res);
            this.dataSource.data = res;
            this.paginator.length = res.length;
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

            if ((event as Sort).active) {
                this.query.paginator = { pageIndex: 1, pageSize: this.paginator.pageSize };
                this.query.sort = { orderBy: this.sort.active, orderDirection: this.sort.direction };
            } else {
                this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
            }

            this.initData();
        });
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
        const fl: Filter = { ...f, column };
        const index = this.query.filters.findIndex(_ => _.column === column);
        if (index > -1) {
            this.query.filters[index] = fl;
        } else {
            this.query.filters.push(fl);
        }

        this.initData();
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
