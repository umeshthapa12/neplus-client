import { takeUntil, delay, filter, switchMap, tap, debounceTime } from 'rxjs/operators';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { Subject, merge } from 'rxjs';
import { Component, OnInit, OnDestroy, ViewChild, ChangeDetectorRef, AfterViewInit } from '@angular/core';
import { QueryModel, Filter } from '../../../../../models';
import { DeleteConfirmComponent, SnackToastService } from '../../../../shared';
import { ParamGenService, collectionInOut, ExtendedMatDialog, fadeIn } from '../../../../../utils';
import { BranchService } from './branch.service';
import { BranchFormComponent } from './branch-form.component';

@Component({
    templateUrl: './branch.component.html',
    animations: [collectionInOut, fadeIn],
    styleUrls: ['./branch.component.scss']
})
export class BranchComponent implements OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    isLoadingResults = true;
    branches: any[] = [];
    query: QueryModel = { filters: [], sort: {} };
    // hasFilter: boolean = this.paramGen.hasFilter;
    constructor(private branchService: BranchService,
                private cdr: ChangeDetectorRef,
                private notify: SnackToastService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
                private paramGen: ParamGenService) { }
    trackById = (_: number, item: any) => item.id;


    onAction(id: number) {
        let instance: MatDialogRef<BranchFormComponent, any>;
        const data = this.branches.find(x => x.id === id);
        instance = this.dialog.open(BranchFormComponent, {
            height: 'auto',
            width: '900px',
            data: data ? data : {},
            autoFocus: false,
        });

        this.dialogUtil.animateBackdropClick(instance);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(res => res && res),
                tap(res => {
                    // console.log(res);
                    this.cdr.markForCheck();
                    const d: any = res;
                    const index = this.branches.findIndex(x => x.id === d.id);
                    if (index > -1) {
                        this.branches[index] = d;
                    } else {
                        this.branches.unshift(d);
                    }
                })).subscribe({
                    next: res => [this.notify.when('success', res, this.resetFlags)],
                    error: e => this.notify.when('danger', e, this.resetFlags),
                });

    }

    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.branchService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.branches.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.branches.splice(index, 1);
                        this.paginator.length--;
                    }
                    this.notify.when('success', res, this.resetFlags);
                },
                error: e => this.notify.when('danger', e, this.resetFlags)
            });

    }

    resetFlags = () => { this.isLoadingResults = false; };

    //   private resetFlags() {
    //       this.isLoadingResults = false;
    //   }

    private initData() {
        this.cdr.markForCheck();
        this.branches = [];
        this.isLoadingResults = true;

        //   this.branchService.getBranch(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
        //         this.cdr.markForCheck();
        //         this.branches = (res.contentBody.items || []);
        //         this.paginator.length = (res.contentBody.totalItems || 0);
        //         this.isLoadingResults = false;
        //         // this.branches._updateChangeSubscription();
        //         // console.log(this.dataSource.data)
        //     }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);

        this.branchService.getList().pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
            this.cdr.markForCheck();
            this.branches = (res || []);
            this.paginator.length = (res.length || 0);
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


    // filter(f: Filter, column: string) {
    //     const f1: Filter = {...f, column};
    //     const index = this.query.filters.findIndex(x => x.column === column);
    //     if
    //     (index > -1) {
    //         this.query.filters[index] = f1;
    //     } else {
    //         this.query.filters.push(f1);
    //     }
    //     this.initData();
    // }

    // sortSelectionChange(s: MatSelectChange) {
    //     this.query.paginator = {pageIndex: 1, pageSize: this.paginator.pageSize};
    //     this.query.sort = {orderBy: 'name', orderDirection: s.value};
    //     this.initData();
    // }

    // resetFilters() {
    //     this.cdr.markForCheck();
    //     this.query = {filters : []};
    //     this.paramGen.clearParams();
    //     this.hasFilter = false;

    //     setTimeout(() => {
    //         this.initData();
    //     }, 200);
    // }

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
