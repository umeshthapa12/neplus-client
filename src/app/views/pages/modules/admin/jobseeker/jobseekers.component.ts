import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Store } from '@ngxs/store';
import { merge, of, Subject } from 'rxjs';
import { debounceTime, delay, takeUntil } from 'rxjs/operators';
import { Filter, JobSeeker, QueryModel } from '../../../../../models';
import { collectionInOut, fadeIn, fadeInOutStagger, ParamGenService, RowContentStatus } from '../../../../../utils';
import { JobSeekerService } from './jobseeker.service';
import { ClearCachedJobSeekersOnDestroyAction, LoadLazyJobseeker } from './store/jobseeker.store';

@Component({
    templateUrl: './jobseekers.component.html',
    animations: [fadeInOutStagger, fadeIn, collectionInOut],
    styleUrls: ['../../../../shared/shared.scss']
})
export class JobseekersComponent implements AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();

    displayedColumns = ['details', 'select', 'sn', 'email', 'fullName', 'gender', 'age', 'maritalStatus'];
    dataSource: MatTableDataSource<JobSeeker> = new MatTableDataSource(null);
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<JobSeeker>(true, []);
    expandedElement: JobSeeker | null;

    isLoadingResults = true;

    // request query
    query: QueryModel = { filters: [] };

    hasFilter: boolean = this.paramGen.hasFilter;

    constructor(
        private cService: JobSeekerService,
        private rowStatus: RowContentStatus,
        private cdr: ChangeDetectorRef,
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
        this.store.dispatch(new ClearCachedJobSeekersOnDestroyAction());
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    rowDetailExpand(row: JobSeeker) {
        this.expandedElement = this.expandedElement === row ? null : row;
        this.store.dispatch(new LoadLazyJobseeker(row.guid));
    }

    trackById = (_: number, item: JobSeeker) => item.id;

    contentStatus = (s: string) => this.rowStatus.initContentStatusCssClass(s);

    rowHeight(row: JobSeeker) {
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

        this.cService.getJobSeekers(this.query)
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe({
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
                this.query.sort = { orderBy: this.sort.active, orderDirection: this.sort.direction };
            } else {
                this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
            }

            this.initData();
        });
    }
}
