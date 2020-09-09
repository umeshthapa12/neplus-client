import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { merge, of, Subject } from 'rxjs';
import { debounceTime, delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Filter, MailTemplate, QueryModel } from '../../../../../models';
import { collectionInOut, CustomAnimationPlayer, ExtendedMatDialog, fadeIn, fadeInOutStagger, ParamGenService } from '../../../../../utils';
import { LoadLazyCompany } from '../companies/store/companies.store';
import { DeleteConfirmComponent, SnackToastService } from '../../../../shared';
import { MailTemplateService } from './mail-template.service';
import { ClearCachedMailTemplateOnDestroyAction, LoadLazyMailTemplate } from './store/mail-template.store';
import { MailtemplateFormComponent } from './mail-template-form.component';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
    templateUrl: './mail-template.component.html',
    animations: [fadeInOutStagger, fadeIn, collectionInOut],
    styleUrls: ['../../../../shared/shared.scss']
})
export class MailTemplateComponent implements AfterViewInit, OnDestroy {

    private readonly toDestroy$ = new Subject<void>();

    displayedColumns = ['details', 'select', 'id', 'title', 'subject', 'sentCounts', 'status', 'action'];
    dataSource: MatTableDataSource<MailTemplate> = new MatTableDataSource(null);
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<MailTemplate>(true, []);
    expandedElement: MailTemplate | null;

    isLoadingResults = true;

    // request query
    query: QueryModel = { filters: [] };

    hasFilter: boolean = this.paramGen.hasFilter;

    constructor(
        private mService: MailTemplateService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private notify: SnackToastService,
        private dialogUtil: ExtendedMatDialog,
        private paramGen: ParamGenService,
        private store: Store,
        private cap: CustomAnimationPlayer,
    ) { }

    ngAfterViewInit() {

        // init default
        this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
        this.initData();

        // executes when table sort/paginator change happens.
        this.initEvents();

    }

    ngOnDestroy() {
        this.store.dispatch(new ClearCachedMailTemplateOnDestroyAction());
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    rowDetailExpand(row: MailTemplate) {
        this.expandedElement = this.expandedElement === row ? null : row;
        this.store.dispatch(new LoadLazyMailTemplate(row.id, row.userGuid));
    }

    trackById = (_: number, item: MailTemplate) => item.id;

    updateStatus(s: string, id: number) {
        const row = this.dataSource.data.find(_ => _.id === id);
        if (row) {
            row.status = s;
        }
        // TODO: update to the API
        this.mService.updateStatus({ id: row.id, status: s }).pipe(
            takeUntil(this.toDestroy$),
        ).subscribe({
            next: res => [
                this.notify.when('success', res),
                this.cap.animate('rubberBand', document.querySelector(`#status${id}`))
            ],
            error: e => this.notify.when('danger', e)
        });
    }

    rowHeight(row: MailTemplate) {
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

    drop(event: CdkDragDrop<MailTemplate[]>) {
        const prevIndex = this.dataSource.data.indexOf(event.item.data);
        moveItemInArray(this.dataSource.data, prevIndex, event.currentIndex);
        this.dataSource._updateChangeSubscription();
    }

    onAction(id: number, guid: string) {
        let instance: MatDialogRef<MailtemplateFormComponent, any>;
        instance = this.dialog.open(MailtemplateFormComponent, {
            width: '1000px',
            maxHeight: '90vh',
            data: { id, guid },
            autoFocus: false,
        });

        this.dialogUtil.animateBackdropClick(instance);

        instance.afterClosed().pipe(
            takeUntil(this.toDestroy$),
            filter(res => res && res.contentBody),
            tap(res => {
                this.cdr.markForCheck();
                // since state context creates readonly props, we have to create a copy of it to modify
                const d: MailTemplate = { ...res.contentBody };
                const index = this.dataSource.data.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    d.sn = this.dataSource.data[index].sn;
                    this.dataSource.data[index] = d;
                } else {
                    this.dataSource.data.unshift(d);
                }
                this.dataSource._updateChangeSubscription();
            }),
            delay(800)
        ).subscribe({
            next: res => [
                this.notify.when('success', res),
                this.dataSource._updateChangeSubscription(),
                res.contentBody.id > 0 ?
                    this.cap.animate('flash', document.querySelector(`#row${res.contentBody.id}`), 900)
                    : null
            ],
            error: e => this.notify.when('danger', e)
        });
    }

    onDelete(id: number, guid: string) {

        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(
                takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.mService.deleteTemplate(id, guid)
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

        this.mService.getTemplates(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe({
            next: res => {
                this.cdr.markForCheck();
                this.dataSource.data = (res.contentBody.items || []);
                this.paginator.length = (res.contentBody.totalItems || 0);
                this.isLoadingResults = false;
            },
            error: _ => [this.cdr.markForCheck(), this.isLoadingResults = false]

        });
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
