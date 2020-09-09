import { DeleteConfirmComponent } from './../../../../shared/delete-confirm/delete-confirm.component';
import { takeUntil, tap, filter, delay, switchMap } from 'rxjs/operators';
import { SnackToastService } from './../../../../shared/snakbar-toast/toast.service';
import { ExtendedMatDialog } from './../../../../../utils/extensions/dialog-animator';
import { RetirementTypeService } from './retirement-type.service';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { RetirementTypeFormComponent } from './retirement-type-form.component';
import { Subject } from 'rxjs';

@Component({
  templateUrl: './retirement-type.component.html',
  styleUrls: ['./retirement-type.component.scss']
})
export class RetirementTypeComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
  constructor(private cdr: ChangeDetectorRef,
              private retirementService: RetirementTypeService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private notify: SnackToastService,
    ) { }
    isLoadingResults: boolean;
    retirements: any[] = [];
    trackById = (_: number, item: any) => item.id;

  ngOnInit() {
      this.initData();
  }

  onAction(id: number) {
      let instance: MatDialogRef<RetirementTypeFormComponent, any>;
      const data=  this.retirements.find(x => x.id === id);
      instance = this.dialog.open(RetirementTypeFormComponent, {
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
          const r: any = res;
          const index = this.retirements.findIndex(x => x.id === r.id);
          if (index > -1) {
              this.retirements[index] = r;
          } else {
              this.retirements.unshift(r);
          }
      }))
      .subscribe({
          next: res => this.notify.when('success', res, this.resetFlags),
          error: e => this.notify.when('danger', e, this.resetFlags)
      });
  }

  private initData() {
      this.cdr.markForCheck();
      this.retirements = [];
      this.isLoadingResults = true;

      this.retirementService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.retirements = (res || []);
          this.isLoadingResults = false;
      }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }

  resetFlags = () => [this.isLoadingResults = false];
  onDelete(id: number) {
      const instance = this.dialog.open(DeleteConfirmComponent)
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(yes => yes),
      switchMap(() => this.retirementService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe({
          next: res => {
              this.cdr.markForCheck();
              const index = this.retirements.findIndex(x => x.id === id);
              if (index > -1) {
                  this.retirements.splice(index , 1);
              }
              this.notify.when('success', res, this.resetFlags);
          }, error: e  => [this.notify.when('danger', e, this.resetFlags)]
      });
  }
  ngOnDestroy() {
      this.toDestroy$.next();
      this.toDestroy$.complete();
  }

}
