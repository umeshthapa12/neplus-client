import { takeUntil, filter, tap, delay, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { LocationService } from './location.service';
import { LocationFormComponent } from './location-form.component';

@Component({
    templateUrl: './location.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
    locations: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

    constructor(private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
                private notify: SnackToastService,
                private locationService: LocationService,
    ) { }

    ngOnInit() {
        this.initData();
    }
    onAction(id: number) {
        let instance: MatDialogRef<LocationFormComponent, any>;
        const data = this.locations.find(x => x.id === id);
        instance = this.dialog.open(LocationFormComponent, {
            width: '700px',
            data: data ? data : {},
            autoFocus: false,
        });

        this.dialogUtil.animateBackdropClick(instance);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(res => res && res),
                tap(res => {
                    this.cdr.markForCheck();
                    const l: any = res;
                    const index = this.locations.findIndex(x => x.id === l.id);
                    if (index > -1) {
                        this.locations[index] = l;
                    } else {
                        this.locations.unshift(l);
                    }
                }))
            .subscribe({
                next: res => this.notify.when('success', res, this.resetFlag),
                error: e => [this.notify.when('danger', e, this.resetFlag)]
            });
    }

    private initData() {
        this.cdr.markForCheck();
        this.locations = [];
        this.isLoadingResults = true;

        this.locationService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.locations = (res || []);
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }
    resetFlag = () => [this.isLoadingResults = false];
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.locationService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.locations.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.locations.splice(index, 1);
                    }
                    this.notify.when('success', res, this.resetFlag);
                }, error: e => [this.notify.when('danger', e, this.resetFlag)]
            });
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
