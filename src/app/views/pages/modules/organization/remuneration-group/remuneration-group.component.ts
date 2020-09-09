import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil, filter, tap, delay, switchMap } from 'rxjs/operators';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { RemunerationService } from './remuneration.service';
import { RemunerationGroupFormComponent } from './remuneration-group-form.component';

@Component({
  templateUrl: './remuneration-group.component.html',
  styleUrls: ['./remuneration-group.component.scss']
})
export class RemunerationGroupComponent implements OnInit, OnDestroy {

  constructor(private cdr: ChangeDetectorRef,
              private remunerationService: RemunerationService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private notify: SnackToastService,
                ) { }
    private toDestroy$ = new Subject<void>();
    isLoadingResults = false;
    remunerations: any[] = [];
    display = false;
    trackById = (_: number, item: any) => item.id;

  ngOnInit() {
      this.initData();
  }


   public isChecked(id: number) {
       const data = this.remunerations.find(x => x.id === id);
       console.log(data);
    //    value : String; // true / false
    //    property : String // is\any isNeedLateApproval
    //    id : number // formdi/ 1,2,3
       console.log(!this.display);
       this.display = !this.display;
  }

  onAction(id: number) {
      let instance: MatDialogRef<RemunerationGroupFormComponent, any>;
      const data = this.remunerations.find(x => x.id === id);
      instance = this.dialog.open(RemunerationGroupFormComponent, {
          width: '800px',
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
          const index = this.remunerations.findIndex(x => x.id === r.id);
          if (index > -1) {
              this.remunerations[index] = r;
          } else {
              this.remunerations.unshift(r);
          }
      })).subscribe({
          next: res => [this.notify.when('success', res, this.resetFlag )],
          error: e => [this.notify.when('danger', e, this.resetFlag)]
      });
  }

  private initData() {
      this.cdr.markForCheck();
      this.remunerations = [];
      this.isLoadingResults = true;

      this.remunerationService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(600))
      .subscribe(res => {
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
      switchMap(() => this.remunerationService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe({
          next: res => {
              this.cdr.markForCheck();
              const index = this.remunerations.findIndex(x => x.id === id);
              if (index > -1) {
                  this.remunerations.splice(index , 1);
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
