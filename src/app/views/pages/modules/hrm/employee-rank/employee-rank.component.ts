import { takeUntil, filter, tap, switchMap, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService } from './../../../../shared/';
import { ExtendedMatDialog } from './../../../../../utils';
import { DeleteConfirmComponent } from './../../../../shared';
import { EmployeeRankService } from './employee-rank.service';
import { EmployeeRankFormComponent } from './employee-rank-form.component';

@Component({
  selector: 'app-employee-rank',
  templateUrl: './employee-rank.component.html',
  styleUrls: ['./employee-rank.component.scss']
})
export class EmployeeRankComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    employees: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private notify: SnackToastService,
              private employeeRankService: EmployeeRankService,
            ) { }

  ngOnInit() {
      this.initData();
  }
  onAction(id: number) {
      let instance: MatDialogRef<EmployeeRankFormComponent, any>;
      const data = this.employees.find(x => x.id === id);
      instance = this.dialog.open(EmployeeRankFormComponent, {
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
          const e: any = res;
          const index = this.employees.findIndex(x => x.id === e.id);
          if (index > -1) {
              this.employees[index] = e;
          } else {
              this.employees.unshift(e);
          }
      })).subscribe({
          next: res => this.notify.when('success', res, this.resetFlags),
          error: e => [this.notify.when('success', e, this.resetFlags)]
      });
  }

  resetFlags = () => [this.isLoadingResults = false];
  onDelete(id: number) {
      const instance = this.dialog.open(DeleteConfirmComponent);
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(_ => _),
      switchMap(() => this.employeeRankService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe({
          next: res => {
              this.cdr.markForCheck();
              const index = this.employees.findIndex(x => x.id === id);
              if (index > -1) {
                  this.employees.splice(index , 1);
              }
              this.notify.when('success', res, this.resetFlags);
          }, error: e => [this.notify.when('danger', e, this.resetFlags)]
      });
  }


  private initData() {
      this.cdr.markForCheck();
      this.employees = [];
      this.isLoadingResults = true;

      this.employeeRankService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.employees = (res || []);
          this.isLoadingResults = false;
      }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }
  ngOnDestroy() {
      this.toDestroy$.next();
      this.toDestroy$.complete();
  }

}
