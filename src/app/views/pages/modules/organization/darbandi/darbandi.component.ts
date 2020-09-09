import { takeUntil, filter, tap, switchMap, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService, DeleteConfirmComponent } from './../../../../shared';
import { collectionInOut, ExtendedMatDialog } from './../../../../../utils';
import { DarbandiService } from './darbandi.service';
import { DarbandiFormComponent } from './darbandi-form.component';

@Component({
  templateUrl: './darbandi.component.html',
  animations: [collectionInOut],
  styleUrls: ['./darbandi.component.scss']
})
export class DarbandiComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    isLoadingResults: boolean;
    darbandies: any[] = [];
    trackById = (_: number, item: any) => item.id;
  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private darbandiService: DarbandiService,
              private notify: SnackToastService,
    ) { }

  ngOnInit() { }
  onAction(id: number) {
      let instance: MatDialogRef<DarbandiFormComponent, any>;
      const data = this.darbandies.find(x => x.id === id);
      instance = this.dialog.open(DarbandiFormComponent, {
          width: '900px',
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
          const index = this.darbandies.findIndex(x => x.id === d.id);
          if (index > -1) {
              this.darbandies[index] = d;
          } else {
              this.darbandies.unshift(d);
          }
      })
      ).subscribe({
          next: res => [this.notify.when('success', res, this.resetFlags)],
          error: e => this.notify.when('danger', e, this.resetFlags)
      });
  }

  resetFlags = () => [this.isLoadingResults = false];

  onDelete(id: number) {
     let  instance = this.dialog.open(DeleteConfirmComponent);
     instance.afterClosed()
     .pipe(takeUntil(this.toDestroy$),
     filter(yes => yes),
     switchMap(() => this.darbandiService.delete(id)
     .pipe(takeUntil(this.toDestroy$))))
     .subscribe({
         next: res => {
             this.cdr.markForCheck();
             const index = this.darbandies.findIndex(x => x.id === id);
             if (index > -1) {
                 this.darbandies.splice(index, 1);
             }
             this.notify.when('success', res, this.resetFlags);
         }, error: e => this.notify.when('danger', e, this.resetFlags)
     });
  }

private initData() {
    this.cdr.markForCheck();
    this.darbandies = [];
    this.isLoadingResults = true;


    this.darbandiService.getList()
    .pipe(takeUntil(this.toDestroy$),
    delay(600))
    .subscribe(res => {
        this.cdr.markForCheck();
        this.darbandies = (res || []);
        this.isLoadingResults = false;
    }, _ => [this.isLoadingResults = false]);
}

  ngAfterViewInit() {
      this.initData();
  }
  ngOnDestroy() {
    this.toDestroy$.next();
    this.toDestroy$.complete();
  }

}
