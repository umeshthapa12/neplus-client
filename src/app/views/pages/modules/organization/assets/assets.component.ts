import { takeUntil, delay, filter, switchMap, tap, debounceTime } from 'rxjs/operators';
import { Subject, merge } from 'rxjs';
import { Component, AfterViewInit, ChangeDetectorRef, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ExtendedMatDialog } from './../../../../../utils';
import { QueryModel } from './../../../../../models';
import { DeleteConfirmComponent, SnackToastService } from './../../../../shared';
import { AssetsService } from './assets.service';
import { AssetsFormComponent } from './assets-form.component';


@Component({
    templateUrl: './assets.component.html',
    styleUrls: ['./assets.component.scss']
})
export class AssetsComponent implements AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    assets: any[] = [];
    query: QueryModel = {};
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;


    constructor(private assetsService: AssetsService,
                private dialog: MatDialog,
                private cdr: ChangeDetectorRef,
                private notify: SnackToastService,
                private dialogUtil: ExtendedMatDialog) { }

    onAction(id: number) {
        let instance: MatDialogRef<AssetsFormComponent, any>;
        const data = this.assets.find(x => x.id === id);
        instance = this.dialog.open(AssetsFormComponent, {
            width: '500px',
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
                    const index = this.assets.findIndex(x => x.id === d.id);
                    if (index > -1) {
                        this.assets[index] = d;
                    } else {
                        this.assets.unshift(d);
                    }
                })).subscribe({
                    next: res => { this.notify.when('success', res, this.resetFlags); },
                    error: e => { this.notify.when('danger', e, this.resetFlags); }
                });

    }

    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.assetsService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe({
                next: res => {
                    //   console.log(res);
                    this.cdr.markForCheck();
                    const index = this.assets.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.assets.splice(index);
                        this.paginator.length--;
                    }
                    this.notify.when('success', res, this.resetFlags);
                }, error: e => this.notify.when('danger', e, this.resetFlags)
            });
    }

    resetFlags = () => { this.isLoadingResults = false; };

    private initData() {
        this.cdr.markForCheck();
        this.assets = [];
        this.isLoadingResults = true;

        this.assetsService.getList()
            .pipe(takeUntil(this.toDestroy$),
                delay(500))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.assets = (res || {});
                this.paginator.length = (res.length || 0);
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);

    }

    ngAfterViewInit() {
        this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
        this.initData();
        this.initEvents();

    }

    private initEvents() {
        const obs = [
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

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
