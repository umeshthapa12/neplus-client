import { Component, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChild } from '@angular/core';
import { Subject, merge, of } from 'rxjs';
import { takeUntil, filter, tap, debounceTime, switchMap, delay } from 'rxjs/operators';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort, Sort } from '@angular/material/sort';
import { SelectionModel } from '@angular/cdk/collections';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import {
    fadeIn, fadeInOutStagger, collectionInOut, ParamGenService, ExtendedMatDialog, CustomAnimationPlayer
} from '../../../../../../../../src/app/utils';
import { MatPaginator } from '@angular/material/paginator';
import { QueryModel, Filter } from '../../../../../../../../src/app/models';
import { SnackToastService, DeleteConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { BerujuAuditFormComponent } from './beruju-audit-form.component';
import { BerujuAuditService } from './beruju-audit.service';
import { LetterPreviewComponent } from './letter-preview.component';

@Component({
    templateUrl: './beruju-audit.component.html',
    styleUrls: ['./beruju-audit.scss'],
    animations: [fadeIn, fadeInOutStagger, collectionInOut],
})
export class BerujuAuditComponent implements AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    displayedColumns = ['select', 'id', 'title', 'subject', 'body', 'status', 'action'];
    dataSource: MatTableDataSource<any> = new MatTableDataSource();
    @ViewChild(MatPaginator) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<any>(true, []);

    isLoadingResults = true;
    query: QueryModel = { filters: [] };
    hasFilter: boolean = this.paramGen.hasFilter;

    constructor(
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private paramGen: ParamGenService,
        private dialogUtil: ExtendedMatDialog,
        private baService: BerujuAuditService,
        private cap: CustomAnimationPlayer,
        private notify: SnackToastService
    ) { }

    trackById = (_: number, item: any) => item.id;

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
        // let instance: MatDialogRef<BerujuAuditFormComponent, ResponseModel>;
        let instance: MatDialogRef<BerujuAuditFormComponent, any>;
        const data = this.dataSource.data.find(_ => _.id === id);
        instance = this.dialog.open(BerujuAuditFormComponent, {
            width: '800px',
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

    private initData() {
        this.cdr.markForCheck();
        this.dataSource.data = [];
        this.isLoadingResults = true;

        // this.baService.getBerujuAudits(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
        //     this.cdr.markForCheck();
        //     this.dataSource.data = (res.contentBody.items || []);
        //     this.paginator.length = (res.contentBody.totalItems || 0);
        //     this.isLoadingResults = false;

        // }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);

        this.baService.getList().pipe(takeUntil(this.toDestroy$), delay(1000)).subscribe(res => {
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

            if ((event as Sort).active) {
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
                // switchMap(() => this.baService.deleteBerujuAudit(id)
                //     .pipe(takeUntil(this.toDestroy$)))
                switchMap(() => this.baService.deleteList(id)
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

    private resetFlags() {
        this.isLoadingResults = false;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    sendLetter() {
        this.dialog.open(LetterPreviewComponent).afterClosed(

        ).pipe().subscribe();
    }
}
