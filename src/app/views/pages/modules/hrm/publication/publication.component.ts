import { DeleteConfirmComponent, SnackToastService } from './../../../../shared';
import { PublicationFormComponent } from './publication-form.component';
import { ResponseModel } from './../../../../../models/app.model';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { fadeInOutStagger, ExtendedMatDialog } from './../../../../../utils';
import { PublicationService } from './publication.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

@Component({
    templateUrl: './publication.component.html',
    styleUrls: ['./publication.component.scss'],
    animations: [fadeInOutStagger]
})
export class PublicationComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    constructor(private cdr: ChangeDetectorRef,
                private publicationService: PublicationService,
                private dialog: MatDialog,
                private dialogUtil: ExtendedMatDialog,
                private snackBar: SnackToastService,
    ) { }

    publications: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

    ngOnInit() {
        this.initData();
    }

    onAction(id: number) {
        let instance: MatDialogRef<PublicationFormComponent, any>;
        const data = this.publications.find(x => x.id === id);
        instance = this.dialog.open(PublicationFormComponent, {
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
                    const p: any = res;
                    const index = this.publications.findIndex(x => x.id === p.id);
                    if (index > -1) {
                        this.publications[index] = p;
                    } else {
                        this.publications.unshift(p);
                    }
                })).subscribe(res =>
                    this.onSuccess(res), e => this.onError(e));
    }
    private initData() {
        this.cdr.markForCheck();
        this.publications = [];
        this.isLoading = true;

        this.publicationService.getList()
            .pipe(takeUntil(this.toDestroy$), delay(600))
            .subscribe(res => {
                this.cdr.markForCheck();
                this.publications = (res || []);
                this.isLoading = false;
            }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
    }
    onDelete(id: number) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(takeUntil(this.toDestroy$),
                filter(_ => _),
                switchMap(() => this.publicationService.delete(id)
                    .pipe(takeUntil(this.toDestroy$))))
            .subscribe(res => {
                this.cdr.markForCheck();
                const index = this.publications.findIndex(x => x.id === id);
                if (index > -1) {
                    this.publications.splice(index, 1);
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
