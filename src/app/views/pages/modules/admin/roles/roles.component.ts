import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSelectChange } from '@angular/material/select';
import { merge, Subject } from 'rxjs';
import { debounceTime, delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Companies, Filter, QueryModel, ResponseModel, Roles } from '../../../../../models';
import { collectionInOut, ExtendedMatDialog, fadeIn, ParamGenService } from '../../../../../utils';
import { DeleteConfirmComponent, SnackToastService } from '../../../../shared';
import { RoleFormComponent } from './role-form.component';
import { RoleService } from './roles.service';

@Component({
    templateUrl: './roles.component.html',
    animations: [collectionInOut, fadeIn],
})
export class RolesComponent implements AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    roles: Roles[] = [];
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    isLoadingResults = true;

    // request query
    query: QueryModel = { filters: [], sort: {} };

    hasFilter: boolean = this.paramGen.hasFilter;
    constructor(
        private cdr: ChangeDetectorRef,
        private rService: RoleService,
        private paramGen: ParamGenService,
        private notify: SnackToastService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
    ) { }


    ngAfterViewInit() {

        // init default
        this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
        this.initData();

        // executes when table sort/paginator change happens.
        this.initEvents();

    }

    trackById = (_: number, item: Roles) => item.id;

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    resetFilters() {
        this.cdr.markForCheck();
        this.query = { filters: [], sort: {} };
        this.paramGen.clearParams();
        this.hasFilter = false;

        setTimeout(() => {
            this.initData();
        }, 200);
    }

    onAction(id: number) {
        let instance: MatDialogRef<RoleFormComponent, ResponseModel>;
        const role = this.roles.find(_ => _.id === id);
        instance = this.dialog.open(RoleFormComponent, {
            width: '400px',
            data: { role },
            autoFocus: false,

        });

        this.dialogUtil.animateBackdropClick(instance);

        instance.afterClosed().pipe(
            takeUntil(this.toDestroy$),
            filter(res => res && res.contentBody),
            tap(res => {
                this.cdr.markForCheck();
                const d: Companies = res.contentBody;
                const index = this.roles.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    this.roles[index] = d;
                } else {
                    this.roles.unshift(d);
                }
            })
        ).subscribe({
            next: res => [this.notify.when('success', res, this.resetFlags)],
            error: e => this.notify.when('danger', e, this.resetFlags)
        });
    }

    resetFlags = () => { this.isLoadingResults = false; };

    onDelete(id: number) {

        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(
                takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.rService.deleteRole(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.roles.findIndex(_ => _.id === id);
                    if (index > -1) {
                        this.roles.splice(index, 1);
                        // decrease the length of total items
                        this.paginator.length--;
                    }
                    this.notify.when('success', res, this.resetFlags);
                },
                error: e => this.notify.when('danger', e, this.resetFlags)
            });

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

    sortSelectionChange(s: MatSelectChange) {
        // reset paginator to default when sort happens
        this.query.paginator = { pageIndex: 1, pageSize: this.paginator.pageSize };
        // const s = event as Sort;
        this.query.sort = { orderBy: 'Name', orderDirection: s.value };

        this.initData();
    }

    private initData() {
        this.cdr.markForCheck();
        this.roles = [];
        this.isLoadingResults = true;

        this.rService.getRoles(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
            this.cdr.markForCheck();
            this.roles = (res.contentBody.items || []);
            this.paginator.length = (res.contentBody.totalItems || 0);
            this.isLoadingResults = false;
        }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }

    private initEvents() {
        const obs = [
            // this.sort ? this.sort.sortChange : of(),
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
}

