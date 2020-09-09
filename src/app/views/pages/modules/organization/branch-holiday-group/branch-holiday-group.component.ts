import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExtendedMatDialog } from './../../../../../utils';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { BranchHolidayGroupService } from './branch-holiday-group.service';
import { BranchHolidayGroupFormComponent } from './branch-holiday-group-form.component';

@Component({
    templateUrl: './branch-holiday-group.component.html',
    styleUrls: ['./branch-holiday-group.component.scss']
})
export class BranchHolidayGroupComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    branchHolidays: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

    constructor(private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
                private notify: SnackToastService,
                private branchHolidayService: BranchHolidayGroupService,
    ) { }

    ngOnInit() {
        this.initData();
    }
    onAction(id: number) {
        let instance: MatDialogRef<BranchHolidayGroupFormComponent, any>;
        const data = this.branchHolidays.find(x => x.id === id);
        instance = this.dialog.open(BranchHolidayGroupFormComponent, {
            width: '500px',
            data: data ? data : {},
            autoFocus: false,
        });
        this.dialogUtil.animateBackdropClick(instance);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(res => res && res),
                tap(res => {
                    this.cdr.markForCheck();
                    const h: any = res;
                    const index = this.branchHolidays.findIndex(x => x.id === h.id);
                    if (index > -1) {
                        this.branchHolidays[index] = h;
                    } else {
                        this.branchHolidays.unshift(h);
                    }
                })).subscribe({
                    next: res => this.notify.when('success', res, this.resetFlags),
                    error: e => [this.notify.when('danger', e, this.resetFlags)]
                });
    }

    resetFlags = () => [this.isLoadingResults = false];
    private initData() {
        this.cdr.markForCheck();
        this.branchHolidays = [];
        this.isLoadingResults = true;

        this.branchHolidayService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.branchHolidays = (res || []);
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.branchHolidayService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe({
                next: res => {
                    console.log(res);
                    this.cdr.markForCheck();
                    const index = this.branchHolidays.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.branchHolidays.splice(index, 1);
                    }
                    this.notify.when('success', res, this.resetFlags);
                }, error: e => [this.notify.when('danger', e, this.resetFlags)]
            });
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
