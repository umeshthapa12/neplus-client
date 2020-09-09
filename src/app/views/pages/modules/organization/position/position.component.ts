import { Subject } from 'rxjs';
import { takeUntil, filter, tap, delay, switchMap } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { PositionService } from './position.service';
import { PositionFormComponent } from './position-form.component';


@Component({
  templateUrl: './position.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
    positions: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private positionService: PositionService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private notify: SnackToastService,
    ) { }

  ngOnInit() {
      this.initData();
  }
  onAction(id: number) {
      let instance: MatDialogRef<PositionFormComponent, any>;
      const data =  this.positions.find(x => x.id === id);
      instance = this.dialog.open(PositionFormComponent, {
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
          const index = this.positions.findIndex(x => x.id === p.id);
          if (index > -1) {
              this.positions[index] = p;
          } else {
              this.positions.push(p);
          }
      })).subscribe({
          next: res => this.notify.when('success', res, this.resetFlag),
          error: e => [this.notify.when('danger', e, this.resetFlag)]
      });
  }

  private initData() {
      this.cdr.markForCheck();
      this.positions = [];
      this.isLoadingResults = true;

      this.positionService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.positions = (res || []);
          this.isLoadingResults = false;
      }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }

  resetFlag = () => [this.isLoadingResults = false];
  onDelete(id: number) {
      let instance = this.dialog.open(DeleteConfirmComponent)
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(yes => yes),
      switchMap(() => this.positionService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe({
          next: res => {
              this.cdr.markForCheck();
              const index = this.positions.findIndex(x => x.id === id);
              if (index > -1) {
                  this.positions.splice(index, 1);
              }
              this.notify.when('success', res, this.resetFlag);
          }, error: e => [this.notify.when('danger', e, this.resetFlag )]
      });
  }
ngOnDestroy() {
    this.toDestroy$.next();
    this.toDestroy$.complete();
}
}
