import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from './../../../../../models';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { fadeInOutStagger, ExtendedMatDialog } from './../../../../../utils';
import { FamilyDetailsService } from './family-details.service';
import { FamilyDetailsFormComponent } from './family-details-form.component';


@Component({
    templateUrl: './family-details.component.html',
    styleUrls: ['./family-details.component.scss'],
    animations: [fadeInOutStagger]
})
export class FamilyDetailsComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    familyDetails: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    constructor(private cdr: ChangeDetectorRef,
                private familyService: FamilyDetailsService,
                private snackBar: SnackToastService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
    ) { }

    ngOnInit() {
        this.initDate();
    }
    onAction(id: number) {
        let instance: MatDialogRef<FamilyDetailsFormComponent, any>;
        const data = this.familyDetails.find(x => x.id === id);
        instance = this.dialog.open(FamilyDetailsFormComponent, {
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
                    const f: any = res;
                    const index = this.familyDetails.findIndex(x => x.id === f.id);
                    if (index > -1) {
                        this.familyDetails[index] = f;
                    } else {
                        this.familyDetails.unshift(f);
                    }
                })).subscribe(res =>
                    this.onSuccess(res),
                    e => this.onError(e));
    }

    private initDate() {
        this.cdr.markForCheck();
        this.familyDetails = [];
        this.isLoading = true;

        this.familyService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(500))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.familyDetails = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading = false]);

    }
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.familyService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.familyDetails.findIndex(x => x.id === id);
                if (index > -1) {
                    this.familyDetails.splice(index, 1);
                }
                this.onSuccess(res);
            }, e => this.onError(e));
    }

    private onSuccess(res: ResponseModel) {
        this.cdr.markForCheck();
        this.snackBar.when('success', res);
        this.isLoading = false;
    }

    private onError(e: any) {
        this.cdr.markForCheck();
        this.snackBar.when('danger', e);
        this.isLoading = false;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
