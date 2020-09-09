import { takeUntil, filter, tap, delay, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService } from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { DeleteConfirmComponent } from './../../../../shared';
import { SectionFormComponent } from './section-form.component';
import { SectionService } from './section.service';

@Component({
   templateUrl: './section.component.html',
  styleUrls: ['./section.component.scss']
})
export class SectionComponent implements OnInit, OnDestroy {
private toDestroy$ = new Subject<void>();
sections: any[] = [];
isLoadingResults = true;
trackById = (_: number, item: any) => item.id;
  constructor(private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private notify: SnackToastService,
              private sectionService: SectionService,
    ) { }

  ngOnInit() {
      this.initData();
  }
  onAction(id: number) {
      let instance: MatDialogRef<SectionFormComponent, any>;
      const data =  this.sections.find(x => x.id === id);
      instance = this.dialog.open(SectionFormComponent, {
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
         const s: any = res;
         const index = this.sections.findIndex(x => x.id === s.id);
         if (index > -1) {
             this.sections[index] = s;
         } else {
             this.sections.unshift(s);
         }
     }))
     .subscribe({
         next: res => this.notify.when('success', res, this.resetFlags),
         error: e => [this.notify.when('danger', e, this.resetFlags)]
     });
  }

  private initData() {
      this.cdr.markForCheck();
      this.sections = [];
      this.isLoadingResults = true;

      this.sectionService.getList()
      .pipe(takeUntil(this.toDestroy$),
      delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.sections = (res || []);
          this.isLoadingResults = false;
      }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }

  resetFlags = () => [this.isLoadingResults = false];
  onDelete(id: number) {
      const instance = this.dialog.open(DeleteConfirmComponent)
      instance.afterClosed()
      .pipe(takeUntil(this.toDestroy$),
      filter(yes => yes),
      switchMap(() => this.sectionService.delete(id)
      .pipe(takeUntil(this.toDestroy$))))
      .subscribe({
          next: res => {
              this.cdr.markForCheck();
              const index = this.sections.findIndex(x => x.id === id);
              if (index > -1) {
                  this.sections.splice(index , 1);
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
