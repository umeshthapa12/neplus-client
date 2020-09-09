import { takeUntil, filter, tap, delay, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExtendedMatDialog } from './../../../../../utils';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { DivisionFormComponent } from './division-form.component';
import { DivisionService } from './division.service';


@Component({
    templateUrl: './division.component.html',
    styleUrls: ['./division.component.scss']
})
export class DivisionComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    isLoadingResults: boolean;
    divisions: any[] = [];
    trackById = (_: number, item: any) => item.id;

    constructor(private cdr: ChangeDetectorRef,
                private notify: SnackToastService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
                private divisionService: DivisionService,
    ) { }

    ngOnInit() {
        //   this.initData();
    }
    onAction(id: number) {
        let instance: MatDialogRef<DivisionFormComponent, any>;
        const data = this.divisions.find(x => x.id === id);
        instance = this.dialog.open(DivisionFormComponent, {
            width: '500px',
            data: data ? data : {},
            autoFocus: false,
        });
        this.dialogUtil.animateBackdropClick(instance);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(res => res && res),
                tap(res => {
                    console.log(res);
                    this.cdr.markForCheck();
                    const d: any = res;
                    const index = this.divisions.findIndex(x => x.id === d.id);
                    if (index > -1) {
                        this.divisions[index] = d;
                    } else {
                        this.divisions.unshift(d);
                    }
                }))
            .subscribe({
                next: res => [this.notify.when('success', res, this.resetFlag)],
                error: e => [this.notify.when('success', e, this.resetFlag)]
            });
    }

    initData() {
        this.cdr.markForCheck();
        this.divisions = [];
        this.isLoadingResults = true;

        this.divisionService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.divisions = (res || []);
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }

    resetFlag = () => { this.isLoadingResults = false; };

    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.divisionService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.divisions.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.divisions.splice(index, 1);
                    }
                    this.notify.when('success', res, this.resetFlag);
                }, error: e => [this.notify.when('danger', e, this.resetFlag)]
            });
    }
    ngAfterViewInit() {
        this.initData();
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
