import { takeUntil, filter, tap, delay, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { JoiningAsService } from './joining-as.service';
import { JoiningAsFormComponent } from './joining-as-form.component';

@Component({
  selector: 'app-joining-as',
  templateUrl: './joining-as.component.html',
  styleUrls: ['./joining-as.component.scss']
})
export class JoiningAsComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
    joinings: any[] = [];
    isLoadingResults =  true;
    trackById = (_: number, item: any) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private joiningService: JoiningAsService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private notify: SnackToastService,
    ) { }

  ngOnInit() {
      this.initData();
  }

  onAction(id: number) {
      let instance: MatDialogRef<JoiningAsFormComponent, any>;
      const data =  this.joinings.find(x => x.id === id);
      instance = this.dialog.open(JoiningAsFormComponent, {
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
          const j: any = res;
          const index = this.joinings.findIndex(x => x.id === j.id);
          if (index > -1) {
              this.joinings[index] = j;
          } else {
              this.joinings.push(j);
          }

      })).subscribe({
          next: res => [this.notify.when('success', res, this.resetFlag)],
          error: e => [this.notify.when('danger', e, this.resetFlag)]
      });
  }
  initData() {
      this.cdr.markForCheck();
      this.joinings = [];
      this.isLoadingResults = true;

      this.joiningService.getList()
      .pipe(takeUntil(this.toDestroy$),
      delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.joinings = (res || []);
          this.isLoadingResults = false;
      },  _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }

  resetFlag = () => [this.isLoadingResults = false];
  onDelete(id: number) {
      this.dialog.open(DeleteConfirmComponent)
      .afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(yes => yes),
      switchMap(() => this.joiningService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe({
          next: res => {
              this.cdr.markForCheck();
              const index = this.joinings.findIndex(x => x.id === id);
              if (index > -1) {
                  this.joinings.splice(index, 1);
              }
              this.notify.when('success', res, this.resetFlag);
          }, error: e => this.notify.when('danger', e, this.resetFlag)
      });
  }
  ngOnDestroy() {
      this.toDestroy$.next();
      this.toDestroy$.complete();
  }

}
