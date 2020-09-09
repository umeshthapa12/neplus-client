import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExtendedMatDialog } from './../../../../../utils';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { DesignationFormComponent } from './designation-form.component';
import { DesignationService } from './designation.service';


@Component({
    templateUrl: './designation.component.html',
    styleUrls: ['./designation.component.scss']
})
export class DesignationComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
    designation: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

    constructor(private designationService: DesignationService,
                private cdr: ChangeDetectorRef,
                private notify: SnackToastService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,

    ) { }

    ngOnInit() {
        this.initDate();
    }
    onAction(id: number) {
        let instance: MatDialogRef<DesignationFormComponent, any>;
        const data = this.designation.find(x => x.id === id);
        instance = this.dialog.open(DesignationFormComponent, {
            width: '600px',
            data: data ? data : {},
            autoFocus: false,
        });
        this.dialogUtil.animateBackdropClick(instance);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(res => res && res),
                tap(res => {
                    this.cdr.markForCheck();
                    const d: any = res;
                    const index = this.designation.findIndex(x => x.id === d.id);
                    if (index > -1) {
                        this.designation[index] = d;
                        this.isLoadingResults = true;
                    } else {
                        this.designation.unshift(d);
                    }
                }))
            .subscribe({
                next: res => [this.notify.when('success', res, this.resetFlags)],
                error: e => [this.notify.when('danger', e, this.resetFlags)]
            });
    }

    resetFlags = () => { this.isLoadingResults = false; };

    private initDate() {
        this.cdr.markForCheck();
        this.designation = [];
        this.isLoadingResults = true;

        this.designationService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(500))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.designation = (res || []);
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }

    onDelete(id: number) {
        let instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.designationService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.designation.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.designation.splice(index, 1);
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
