import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, AfterViewInit, Pipe } from '@angular/core';
import { SnackToastService } from '../../../../shared';
import { collectionInOut, ExtendedMatDialog } from '../../../../../utils';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { DeleteConfirmComponent } from './../../../../shared';
import { CompanyInformationFormComponent } from './company-information-form.component';
import { CompanyInformationService } from './company-information.service';

@Component({
    templateUrl: './company-information.component.html',
    styleUrls: ['./company-information.component.scss'],
    animations: [collectionInOut]
})
export class CompanyInformationComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    companies: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

    constructor(private cdr: ChangeDetectorRef,
                private companyService: CompanyInformationService,
                private notify: SnackToastService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,

    ) { }

    ngOnInit() {

    }

    onAction(id: number) {
        let instance: MatDialogRef<CompanyInformationFormComponent, any>;
        const data = this.companies.find(x => x.id === id);
        instance = this.dialog.open(CompanyInformationFormComponent, {
            width: '900px',
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
                    const index = this.companies.findIndex(x => x.id === d.id);
                    if (index > -1) {
                        this.companies[index] = d;
                    } else {
                        this.companies.unshift(d);
                    }
                })).subscribe({
                    next: res => [this.notify.when('success', res, this.resetFlags)],
                    error: e => [this.notify.when('danger', e, this.resetFlags)]
                });

    }

    resetFlags = () => { this.isLoadingResults = false; };
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.companyService.delete(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe({
                next: res => {
                    //   console.log(res);
                    this.cdr.markForCheck();
                    const index = this.companies.findIndex(x => x.id === id);
                    if (index > -1) {
                        this.companies.splice(index);
                    }
                    this.notify.when('success', res, this.resetFlags);
                }, error: e => this.notify.when('danger', e, this.resetFlags)
            });
    }

    private initData() {
        this.cdr.markForCheck();
        this.companies = [];
        this.isLoadingResults = true;

        //   this.companyService.getcompany(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
        //         this.cdr.markForCheck();
        //         this.branches = (res.contentBody.items || []);
        //         this.isLoadingResults = false;
        //     }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);

        this.companyService.getList()
            .pipe(takeUntil(this.toDestroy$),
                delay(500))
            .subscribe(res => {
                //    console.log(res);
                this.cdr.markForCheck();
                this.companies = (res || {});
                this.isLoadingResults = false;
            }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }
    ngAfterViewInit() {
        this.initData();
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
