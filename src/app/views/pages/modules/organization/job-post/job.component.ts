import { takeUntil, filter, tap, delay, switchMap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { SnackToastService , DeleteConfirmComponent} from './../../../../shared';
import { ExtendedMatDialog } from './../../../../../utils';
import { JobService } from './job.service';
import { JobFormComponent } from './job-form.component';

@Component({
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.scss']
})
export class JobComponent implements OnInit, OnDestroy {
    private toDestroy$ = new Subject<void>();
    isLoadingResults = true;
    jobs: any[] = [];
    trackById = (_: number, item: any) => item.id;

  constructor(private jobService: JobService,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private dialogUtil: ExtendedMatDialog,
              private notify: SnackToastService,
    ) { }

  ngOnInit() {
      this.initData();
  }
  onAction(id: number) {
      let instance: MatDialogRef<JobFormComponent, any>;
      const data = this.jobs.find(x => x.id === id);
      instance =  this.dialog.open(JobFormComponent, {
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
        const index = this.jobs.findIndex(x => x.id === j.id);
        if (index > -1) {
            this.jobs[index] = j;
        } else {
            this.jobs.unshift(j);
        }

    }))
    .subscribe({
        next: res => [this.notify.when('success', res, this.resetFlags)],
        error: e => [this.notify.when('danger', e, this.resetFlags)]
    });
  }

  initData() {
      this.cdr.markForCheck();
      this.jobs = [];
      this.isLoadingResults = true;

      this.jobService.getList()
      .pipe(takeUntil(this.toDestroy$), delay(600))
      .subscribe(res => {
          this.cdr.markForCheck();
          this.jobs = (res || []);
          this.isLoadingResults = false;
      }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
  }
  resetFlags = () => [this.isLoadingResults = false];
  onDelete(id: number) {
      let instance = this.dialog.open(DeleteConfirmComponent);
      instance.afterClosed()
    .pipe(takeUntil(this.toDestroy$),
    filter(yes => yes),
    switchMap(() => this.jobService.delete(id)
    .pipe(takeUntil(this.toDestroy$))))
    .subscribe({
        next: res => {
            this.cdr.markForCheck();
            const index = this.jobs.findIndex(x => x.id === id);
            if (index > -1) {
                this.jobs.splice(index, 1);
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
