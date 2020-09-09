import { DeleteConfirmComponent } from './../../../../shared/delete-confirm/delete-confirm.component';
import { takeUntil, filter, tap, delay, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService } from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { DepartmentService } from './department.service';
import { DepartmentFormComponent } from './department-form.component';

@Component({
  selector: 'app-department',
  templateUrl: './department.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    departments: any[ ] = [ ];
    isLoadingResults: boolean;
    trackById = (_: number, item: any ) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private departmentService: DepartmentService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private notify: SnackToastService,
    ) { }

  ngOnInit() {
      this.initData();
  }

onAction(id: number) {
let instance: MatDialogRef<DepartmentFormComponent, any>;
const data = this.departments.find(x => x.id === id);
instance = this.dialog.open(DepartmentFormComponent, {
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
    const d: any = res;
    const index = this.departments.findIndex(x => x.id === d.id);
    if (index > -1) {
        this.departments[index] = d;
    } else {
        this.departments.unshift(d);
    }
})).subscribe({
    next: res => { this.notify.when('success', res, this.resetFlags); },
    error: e => {this.notify.when('danger', e, this.resetFlags); },
});

}

resetFlags = () => [this.isLoadingResults = false];

private initData() {
    this.cdr.markForCheck();
    this.departments = [];
    this.isLoadingResults = true;

    this.departmentService.getList()
    .pipe(takeUntil(this.toDestroy$),
    delay(500))
    .subscribe(res => {
        this.cdr.markForCheck();
        this.departments = (res || {});
        this.isLoadingResults = false;
    }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
}
onDelete(id: number) {
    let instance =  this.dialog.open(DeleteConfirmComponent);
    instance.afterClosed()
    .pipe(takeUntil(this.toDestroy$),
    filter(yes => yes),
    switchMap(() => this.departmentService.delete(id)
    .pipe(takeUntil(this.toDestroy$))))
    .subscribe({
        next: res => {
            this.cdr.markForCheck();
            const index = this.departments.findIndex(x => x.id === id);
            if (index > -1) {
                this.departments.splice(index, 1);
            }
            this.notify.when('success', res, this.resetFlags);
        }, error: e => this.notify.when('danger', e, this.resetFlags)
    });
}
ngOnDestroy() {
  this.toDestroy$.next();
  this.toDestroy$.complete();
}

}
