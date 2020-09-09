import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { fadeInOutStagger } from './../../../../../utils';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { ResponseModel } from './../../../../../models';
import { NomineeInformationService } from './nominee-information.service';
import { NomineeInformationFormComponent } from './nominee-information-form.component';

@Component({
  templateUrl: './nominee-information.component.html',
  styleUrls: ['./nominee-information.component.scss'],
  animations: [fadeInOutStagger]
})
export class NomineeInformationComponent implements OnInit {
    private readonly toDestroy$ = new Subject<void>();
    nomineeInformation: any[] = [];
    isLoading = true;
    trackById = (_: number, item: any) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private nomineeService: NomineeInformationService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private snackBar: SnackToastService) { }

  ngOnInit() {
      this.initData();
  }
  onAction(id: number) {
      let instance: MatDialogRef<NomineeInformationFormComponent, any>;
      const data = this.nomineeInformation.find(x => x.id === id);
      instance = this.dialog.open(NomineeInformationFormComponent, {
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
          const n: any = res;
          const index = this.nomineeInformation.findIndex(x => x.id === n.id);
          if (index > -1) {
              this.nomineeInformation[index] = n;
          } else {
              this.nomineeInformation.unshift(n);
          }
      })).subscribe(res =>
        this.onSuccess(res),
        e => this.onError(e));
  }

  private initData() {
      this.cdr.markForCheck();
      this.nomineeInformation = [];
      this.isLoading = true;
      this.nomineeService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(500))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.nomineeInformation = (res || []);
          this.isLoading = false;
      }, _ => [this.cdr.markForCheck(), this.isLoading = false]);
  }
  onDelete(id: number) {
      const instance = this.dialog.open(DeleteConfirmComponent);
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$), filter(_ => _),
      switchMap(() => this.nomineeService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe(res => {
          this.cdr.markForCheck();
          const index = this.nomineeInformation.findIndex(x => x.id === id);
          if (index > -1) {
              this.nomineeInformation.splice(index , 1);
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
