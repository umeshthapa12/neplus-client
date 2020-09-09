import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { ExtendedMatDialog, fadeInOutStagger} from './../../../../../utils';
import { ResponseModel } from './../../../../../models';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { BankAccountDetailsService } from './bank-account-details.service';
import { BankAccountDetailsFormComponent } from './bank-account-details-form.component';

@Component({
animations: [fadeInOutStagger],
  templateUrl: './bank-account-details.component.html',
  styleUrls: ['./bank-account-details.component.scss']
})
export class BankAccountDetailsComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    bankAccounts: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private bankAccountService: BankAccountDetailsService,
              private snackBar: SnackToastService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
    ) { }
  ngOnInit() {
      this.initData();
  }
  onAction(id: number) {
      let instance: MatDialogRef<BankAccountDetailsFormComponent, any>;
      const data = this.bankAccounts.find(x => x.id === id);
      instance = this.dialog.open(BankAccountDetailsFormComponent, {
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
          const b: any = res;
          const index = this.bankAccounts.findIndex(x => x.id === b.id);
          if (index > -1) {
              this.bankAccounts[index] = b;
          } else {
              this.bankAccounts.unshift(b);
          }
      })).subscribe(res =>
        this.onSuccess(res),
       e => this.onError(e));
  }
private initData() {
    this.cdr.markForCheck();
    this.bankAccounts = [];
    this.isLoading = true;

    this.bankAccountService.getList()
    .pipe(takeUntil(this.toDestroy$), delay(600))
    .subscribe(res => {
        this.cdr.markForCheck();
        this.bankAccounts = (res || []);
        this.isLoading = false;
    }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
}

  onDelete(id: number) {
      let instance = this.dialog.open(DeleteConfirmComponent);
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(_ => _),
      switchMap(() => this.bankAccountService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe(res => {
          this.cdr.markForCheck();
          const index = this.bankAccounts.findIndex(x => x.id === id);
          if (index > -1) {
              this.bankAccounts.splice(index , 1);
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
