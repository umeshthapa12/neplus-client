import { takeUntil, tap, filter, delay, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { RemunerationGroupTypeService } from './remuneration-group-type.service';
import { RemunerationGroupTypeFormComponent } from './remuneration-group-type-form.component';

@Component({
  templateUrl: './remuneration-group-type.component.html',
  styleUrls: ['./remuneration-group-type.component.scss']
})
export class RemunerationGroupTypeComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
isLoadingResults = true;
remunerations: any[] = [];
trackById = (_: number, item: any) => item.id;
  constructor(private cdr: ChangeDetectorRef,
              private remunerationGroupService: RemunerationGroupTypeService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private notify: SnackToastService,
    ) { }

  ngOnInit() {
      this.initData();
  }

  onAction(id: number) {
      let instance: MatDialogRef<RemunerationGroupTypeFormComponent, any>;
      const data = this.remunerations.find(x => x.id === id);
      instance = this.dialog.open(RemunerationGroupTypeFormComponent, {
          width: '500px',
          data: data ? data : {},
          autoFocus: false,
      });
      this.dialogUtil.animateBackdropClick(instance);
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(res => res && res),
      tap (res => {
          this.cdr.markForCheck();
          const r: any = res;
          const index = this.remunerations.findIndex(x => x.id === r.id);
          if (index > -1) {
              this.remunerations[index] = r;
          } else {
              this.remunerations.unshift(r);
          }
      })).subscribe({
          next: res => this.notify.when('success', res, this.resetFlag),
          error: e => [this.notify.when('danger', e, this.resetFlag)]
      });
  }

  private initData() {
      this.cdr.markForCheck();
      this.remunerations = [];
      this.isLoadingResults = true;

      this.remunerationGroupService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(500))
      .subscribe(res => {
        //   console.log(res);
          this.cdr.markForCheck();
          this.remunerations = (res || []);
          this.isLoadingResults = false;
      }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }

  resetFlag = () => [this.isLoadingResults = false];
  onDelete(id: number) {
      const instance = this.dialog.open(DeleteConfirmComponent);
      instance.afterClosed()
        .pipe(takeUntil(this.toDestroy$),
        filter(yes => yes),
        switchMap(() => this.remunerationGroupService.delete(id)
        .pipe(takeUntil(this.toDestroy$))))
        .subscribe({
            next: res => {
                this.cdr.markForCheck();
                const index = this.remunerations.findIndex(x => x.id === id);
                if (index > -1) {
                    this.remunerations.splice(index, 1);
                }
                this.notify.when('success', res, this.resetFlag);
            }, error: e => [this.notify.when('danger', e, this.resetFlag)]
        });
  }

  ngOnDestroy() {
      this.toDestroy$.next();
      this.toDestroy$.complete();
  }

}
