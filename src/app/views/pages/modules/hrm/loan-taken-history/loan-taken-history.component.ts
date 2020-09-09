import { takeUntil, delay, filter, switchMap, tap } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { fadeInOutStagger , ExtendedMatDialog } from './../../../../../utils';
import { ResponseModel } from './../../../../../models';
import { SnackToastService , DeleteConfirmComponent} from './../../../../shared/';
import { LoanTakenHistoryService } from './loan-taken-history.service';
import { LoanTakenHistoryFormComponent } from './loan-taken-history-form.component';
@Component({
  templateUrl: './loan-taken-history.component.html',
  styleUrls: ['./loan-taken-history.component.scss'],
  animations: [fadeInOutStagger]
})
export class LoanTakenHistoryComponent implements OnInit {
    private readonly toDestroy$ = new Subject<void>();
    loanTakenHistory: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private loanTakenService: LoanTakenHistoryService,
              private snackBar: SnackToastService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
    ) { }

  ngOnInit() {
      this.initData();
  }
  onAction(id: number) {
      let instance: MatDialogRef<LoanTakenHistoryFormComponent, any>;
      const data = this.loanTakenHistory.find(x => x.id === id);
      instance = this.dialog.open(LoanTakenHistoryFormComponent, {
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
          const l: any = res;
          const index = this.loanTakenHistory.findIndex(x => x.id === l.id);
          if (index > -1) {
              this.loanTakenHistory[index] = l;
          } else {
              this.loanTakenHistory.unshift(l);
          }
      })).subscribe(res =>
        this.onSuccess(res),
        e => this.onError(e));
  }
  private initData() {
      this.cdr.markForCheck();
      this.loanTakenHistory = [];
      this.isLoading = true;

      this.loanTakenService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(500))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.loanTakenHistory = (res || []);
          this.isLoading = false;
      }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
  }
  onDelete(id: number) {
      const instance = this.dialog.open(DeleteConfirmComponent);
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(_ => _),
      switchMap(() => this.loanTakenService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe(res => {
          this.cdr.markForCheck();
          const index = this.loanTakenHistory.find(x => x.id === id);
          if (index > -1) {
              this.loanTakenHistory.splice(index , 1);
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

}
