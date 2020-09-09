import { takeUntil, filter, tap, delay, switchMap } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ExtendedMatDialog } from './../../../../../utils';
import { SnackToastService , DeleteConfirmComponent} from './../../../../shared';
import { ServiceFormComponent } from './service-form.component';
import { ServiceService } from './service.service';


@Component({
  templateUrl: './service.component.html',
  styleUrls: ['./service.component.scss']
})
export class ServiceComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
    services: any[] = [];
    isLoadingResults = true;
    trackById = (_: number, item: any) => item.id;

  constructor(private cdr: ChangeDetectorRef,
              private serviceService: ServiceService,
              private notify: SnackToastService,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
    ) { }

  ngOnInit() {
      this.initData();

  }
  onAction(id: number) {
    let instance: MatDialogRef<ServiceFormComponent, any>;
    const data =  this.services.find(x => x.id === id);
    instance = this.dialog.open(ServiceFormComponent, {
        width: '700px',
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
            this.services.unshift(s);
        }
    })).subscribe({
        next: res => this.notify.when('success', res, this.resetFlags),
        error: e => [this.notify.when('danger', e, this.resetFlags)]
    });
  }

  private initData() {
      this.cdr.markForCheck();
      this.services = [];
      this.isLoadingResults = true;

      this.serviceService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.services = (res || []);
          this.isLoadingResults = false;
      }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }


  onDelete(id: number) {
      const instance = this.dialog.open(DeleteConfirmComponent);
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(yes => yes),
      switchMap(() => this.serviceService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe({
          next: res => {
              this.cdr.markForCheck();
              const index = this.services.findIndex(x => x.id === id);
              if (index > -1) {
                  this.services.splice(index , 1);
              }
              this.notify.when('success', res, this.resetFlags);
          }, error: e => [this.notify.when('danger', e, this.resetFlags)]
      });
  }

  resetFlags = () => [this.isLoadingResults = false];
  ngOnDestroy() {
      this.toDestroy$.next();
      this.toDestroy$.complete();
  }

}
