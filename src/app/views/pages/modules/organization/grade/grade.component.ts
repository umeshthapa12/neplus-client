import { DeleteConfirmComponent } from './../../../../shared/delete-confirm/delete-confirm.component';
import { takeUntil, delay, filter, tap, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { GradeService } from './grade.service';
import { ExtendedMatDialog } from './../../../../../utils/extensions/dialog-animator';
import { SnackToastService } from './../../../../shared/snakbar-toast/toast.service';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { GradeFormComponent } from './grade-form.component';

@Component({
  templateUrl: './grade.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
    isLoadingResults = true;
    grades: any[] = [];
    trackById = (_: number, item: any) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private notify: SnackToastService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private gradeService: GradeService,
    ) { }

  ngOnInit() {
    this.initData();
  }

  onAction(id: number) {
      let instance: MatDialogRef<GradeFormComponent, any>;
      const data = this.grades.find(x => x.id === id);
      instance = this.dialog.open(GradeFormComponent, {
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
          const d: any = res;
          const index = this.grades.findIndex(x => x.id === d.id);
          if (index > -1) {
              this.grades[index] = d;
          } else {
              this.grades.push(d);
          }
      })).subscribe({
          next: res => [this.notify.when('success', res, this.resetFlags)],
          error: e => [this.notify.when('danger', e, this.resetFlags)]
      });

  }

  resetFlags = () => [this.isLoadingResults = false];
  initData() {
      this.cdr.markForCheck();
      this.grades = [];
      this.isLoadingResults = true;

      this.gradeService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.grades =  (res || []);
          this.isLoadingResults = false;
      }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }
  onDelete(id: number) {
    const instance = this.dialog.open(DeleteConfirmComponent);
    instance.afterClosed()
        .pipe(takeUntil(this.toDestroy$),
            filter(yes => yes),
            switchMap(() => this.gradeService.delete(id)
                .pipe(takeUntil(this.toDestroy$))))
        .subscribe({
            next: res => {
                this.cdr.markForCheck();
                const index = this.grades.findIndex(x => x.id === id);
                if (index > -1) {
                    this.grades.splice(index, 1);
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
