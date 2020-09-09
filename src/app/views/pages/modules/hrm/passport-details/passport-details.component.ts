import { takeUntil, delay, tap, filter, switchMap } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ResponseModel } from './../../../../../models';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog, fadeInOutStagger } from './../../../../../utils';
import { PassportDetailsFormComponent } from './passport-details-form.component';
import { PassportDetailsService } from './passport-details.service';

@Component({
  templateUrl: './passport-details.component.html',
  styleUrls: ['./passport-details.component.scss'],
  animations: [fadeInOutStagger]
})
export class PassportDetailsComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    passportDetails: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;
  constructor(private cdr: ChangeDetectorRef,
              private passportService: PassportDetailsService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private snackbar: SnackToastService,
    ) { }

  ngOnInit() {
      this.initData();
  }
  onAction(id: number) {
      let instance: MatDialogRef<PassportDetailsFormComponent, any>;
      const data = this.passportDetails.find(x => x.id === id);
      instance = this.dialog.open(PassportDetailsFormComponent, {
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
          const index = this.passportDetails.findIndex(x => x.id === p.id);
          if (index > -1) {
              this.passportDetails[index] = p;
          } else {
              this.passportDetails.unshift(p);
          }
      })).subscribe(res => this.onSuccess(res),
      e => this.onError(e));
  }

  private initData() {
      this.cdr.markForCheck();
      this.passportDetails = [];
      this.isLoading = true;
      this.passportService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.passportDetails = (res || []);
          this.isLoading = false;
      }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
  }
  onDelete(id: number) {
      const instance = this.dialog.open(DeleteConfirmComponent);
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(_ => _),
      switchMap(() => this.passportService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe(res => {
          this.cdr.markForCheck();
          const index = this.passportDetails.findIndex(x => x.id === id);
          if (index > -1) {
              this.passportDetails.splice(index , 1);
          }
          this.onSuccess(res);
      }, e => this.onError(e));
  }

  private onSuccess(res: ResponseModel) {
      this.cdr.markForCheck();
      this.snackbar.when('success', res);
      this.isLoading = false;
  }
private onError(e: any) {
    this.cdr.markForCheck();
    this.snackbar.when('danger', e);
    this.isLoading = false;
}

  ngOnDestroy() {
      this.toDestroy$.next();
      this.toDestroy$.complete();
  }

}
