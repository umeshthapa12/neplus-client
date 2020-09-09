import { takeUntil, filter, tap, switchMap, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExtendedMatDialog } from './../../../../../utils';
import { SnackToastService } from './../../../../shared';
import { DeleteConfirmComponent } from './../../../../shared';
import { ServiceGroupService } from './service-group.service';
import { ServiceGroupFormComponent } from './service-group-form.component';

@Component({
  selector: 'app-service-group',
  templateUrl: './service-group.component.html',
  styleUrls: ['./service-group.component.scss']
})
export class ServiceGroupComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
    services: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private notify: SnackToastService,
              private dialogUtil: ExtendedMatDialog,
              private serviceGroupService: ServiceGroupService,
    ) { }

  ngOnInit() {
      this.initData();
  }
  onAction(id: number) {
      let instance: MatDialogRef<ServiceGroupFormComponent, any>;
      const data = this.services.find(x => x.id === id);
      instance =  this.dialog.open(ServiceGroupFormComponent, {
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
          const s: any = res;
          const index = this.services.findIndex(x => x.id === s.id);
          if (index > -1) {
              this.services[index] = s;
          } else {
              this.services.push(s);
          }
      })).subscribe({
          next: res => this.notify.when('success', res, this.resetFlag),
          error: e => this.notify.when('danger', e, this.resetFlag)
      });
  }

  private initData() {
      this.cdr.markForCheck();
      this.services = [];
      this.isLoadingResults = true;

      this.serviceGroupService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.services = (res || []);
          this.isLoadingResults = false;
      }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }
  resetFlag = () => [this.isLoadingResults = false];
  onDelete(id: number) {
      const instance = this.dialog.open(DeleteConfirmComponent)
      instance.afterClosed()
      .pipe(filter(yes => yes),
      switchMap(() => this.serviceGroupService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe({
          next: res => {
              this.cdr.markForCheck();
              const index = this.services.findIndex(x => x.id === id);
              if (index > -1) {
                  this.services.splice(index, 1);
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
