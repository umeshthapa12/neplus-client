import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExtendedMatDialog } from './../../../../../utils';
import { SnackToastService , DeleteConfirmComponent} from './../../../../shared/';
import { EmployeeLevelPositionFormComponent } from './employee-level-position-form.component';
import { EmployeeLevelPositionService } from './employee-level-position.service';

@Component({
  selector: 'app-employee-level-position',
  templateUrl: './employee-level-position.component.html',
  styleUrls: ['./employee-level-position.component.scss']
})
export class EmployeeLevelPositionComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void> ();
    employees: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private notify: SnackToastService,
              private employeeLevelService: EmployeeLevelPositionService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
    ) { }

  ngOnInit() {
      this.initData();
  }

  onAction(id: number) {
      let instance: MatDialogRef<EmployeeLevelPositionFormComponent, any>;
      const data =  this.employees.find(x => x.id === id);
      instance = this.dialog.open(EmployeeLevelPositionFormComponent, {
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
          const e: any = res;
          const index = this.employees.findIndex(x => x.id === e.id);
          if (index > -1) {
              this.employees[index] = e;
          } else {
              this.employees.unshift(e);
          }
      })).subscribe ({
          next: res => this.notify.when('success', res, this.resetFlags),
          error: e => [this.notify.when('danger', e, this.resetFlags)]
      });
  }

  resetFlags = () => [this.isLoadingResults = false];

  private initData() {
      this.cdr.markForCheck();
      this.employees = [];
      this.isLoadingResults = true;

      this.employeeLevelService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.employees = (res || []);
          this.isLoadingResults = false;
      }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }
  onDelete(id: number) {
      const instance = this.dialog.open(DeleteConfirmComponent);
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(_ => _),
      switchMap(() => this.employeeLevelService.delete(id)
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
  ngOnDestroy() {
      this.toDestroy$.next();
      this.toDestroy$.complete();
  }

}
