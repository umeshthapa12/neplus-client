import { takeUntil, delay, filter } from 'rxjs/operators';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ChangesConfirmComponent } from './../../../../shared';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { PerformanceService } from './performance.service';

@Component({
  templateUrl: './performance-form.component.html',
  styleUrls: ['./performance.component.scss']
})
export class PerformanceFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    performanceForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElement: ElementRef[];

  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<PerformanceFormComponent>,
              private performanceService: PerformanceService,
              @Inject(MAT_DIALOG_DATA)
                public data: {id: number}
                ) {
                    this.genericValidator = new GenericValidator({});
                 }
                status = [
                    {key: 1, value: 'Active'},
                    {key: 2, value: 'Inactive'},
                ];
                fyscals = [
                    {key: 1, value: '2077/78'},
                    {key: 2, value: '2078/79'}
                ];

  ngOnInit() {
      this.initForm();
  }

  private initForm() {
      this.performanceForm = this.fb.group({
          id: 0,
          empCode: null,
          supervisorMarks: null,
          dateFrom: null,
          dateFromNepali: null,
          dateTo: null,
          dateToNepali: null,
          reviewerMarks: null,
          reviewCommitteeMarks: null,
          performanceRemarks: null,
          appraisalRating: null,
          fiscalYear: null,
          appraisal: null,
          status: null,
      });
      this.performanceForm.valueChanges
      .subscribe(_ => this.dialogRef.disableClose = this.performanceForm.invalid || this.performanceForm.dirty);
  }

  private patchForm(p: any) {
      this.performanceForm.patchValue({
          id: p.id,
          empCode: p.empCode,
          supervisorMarks: p.supervisorMarks,
          dateFrom: p.dateFrom,
          dateFromNepali: p.dateFromNepali,
          dateTo: p.dateTo,
          dateToNepali: p.dateToNepali,
          reviewerMarks: p.reviewerMarks,
          reviewCommitteeMarks: p.reviewCommitteeMarks,
          performanceRemarks: p.performanceRemarks,
          appraisalRating: p.appraisalRating,
          fiscalYear: p.fiscalYear,
          appraisal: p.appraisal,
          status: p.status,
      });
  }
  saveChanges() {
    //   const errorMessage = validateBeforeSubmit(this.performanceForm);
    //   if (errorMessage) {return false; }
      this.isWorking = true;
      this.performanceService.addOrUpdate(this.performanceForm.value)
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
    //   this.genericValidator
    //   .initValidationProcess(this.performanceForm, this.formInputElement)
    //   .subscribe(m => this.displayMessage = m);
      if (this.data.id > 0) {
          this.performanceService.getListById(this.data.id)
          .pipe(takeUntil(this.toDestroy$), delay(600))
          .subscribe(res => {
              this.cdr.markForCheck();
              const p: any = res;
              this.patchForm(p);
          });
      }
  }
  cancel() {
      if (this.performanceForm.dirty) {
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
