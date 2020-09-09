import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ChangesConfirmComponent } from './../../../../shared';
import { ErrorCollection , ResponseModel} from './../../../../../models/app.model';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { JobModeService } from './job-mode.service';

@Component({
  templateUrl: './job-mode-form.component.html',
  styleUrls: ['./job-mode.component.scss']
})
export class JobModeFormComponent implements OnInit , OnDestroy, AfterViewInit{
    private readonly toDestroy$ = new Subject<void>();
    jobModeForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElemen: ElementRef[];
  constructor(
      private cdr: ChangeDetectorRef,
      private fb: FormBuilder,
      private jobModeService: JobModeService,
      private dialog: MatDialog,
      private dialogRef: MatDialogRef<JobModeFormComponent>,
      @Inject(MAT_DIALOG_DATA)
      public data: {id: number},
  ) {
      this.genericValidator = new GenericValidator({
          name: {
              required: 'This is Required Field',
          }
      });
  }

  status = [
      {key: 1, value: 'Active'},
      {key: 2, value: 'Inactive'},
      {key: 3, value: 'Pending'},
  ];

  ngOnInit() {
      this.initData();
  }

  private initData() {
    this.jobModeForm = this.fb.group({
        id: 0,
        name: [null, Validators.required],
        nameNepali: null,
        status: 'Active',
    });
    this.jobModeForm.valueChanges
    .subscribe(_ => [this.dialogRef.disableClose = this.jobModeForm.invalid || this.jobModeForm.dirty]);
  }

  private patchForm(j: any) {
      this.jobModeForm.patchValue({
          id: j.id,
          name: j.name,
          nameNepali: j.nameNepali,
          status: j.status,
      });
  }

  saveChanges() {
      const errorMessage = validateBeforeSubmit(this.jobModeForm);
      if (errorMessage) {return false; }
      this.isWorking = true;
      this.jobModeService.addOrUpdate(this.jobModeForm.value)
      .pipe(takeUntil(this.toDestroy$), delay(1500))
      .subscribe(res => {
          this.dialogRef.close(res);
          this.isWorking = false;
      }, e => {
          this.cdr.markForCheck();
          this.isWorking = false;
          this.isError = true;
          const model: ResponseModel = e.error;
          const errors: ErrorCollection[] = model.contentBody.errors;

          if (errors && errors.length > 0) {
              this.errors = errors;
              this.displayMessage = model.messageBody;
          }
      });
  }

  ngAfterViewInit() {
      this.genericValidator.initValidationProcess(this.jobModeForm, this.formInputElemen)
      .subscribe({next: m => this.displayMessage = m});
      if (this.data.id > 0) {
          this.jobModeService.getListById(this.data.id)
          .pipe(takeUntil(this.toDestroy$), delay(600))
          .subscribe(res => {
              this.cdr.markForCheck();
              const j: any = res;
              this.patchForm(j);
          });
      }
  }
cancel() {
    if (this.jobModeForm.dirty) {
        this.dialog.open(ChangesConfirmComponent)
        .afterClosed()
        .pipe(filter(_ => _))
        .subscribe(_ => this.dialogRef.close());
    } else {
        this.dialogRef.close();
    }
}
ngOnDestroy() {
    this.toDestroy$.next();
    this.toDestroy$.complete();
}
}
