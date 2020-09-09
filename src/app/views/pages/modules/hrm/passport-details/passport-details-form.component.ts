import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ChangesConfirmComponent } from '../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { PassportDetailsService } from './passport-details.service';

@Component({
  templateUrl: './passport-details-form.component.html',
  styleUrls: ['.././employee-management/employee.scss']
})
export class PassportDetailsFormComponent implements OnInit , OnDestroy, AfterViewInit{
    private readonly toDestroy$ = new Subject<void>();
    passportDetailsForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElement: ElementRef[];

  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private passportService: PassportDetailsService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<PassportDetailsFormComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: {id: number},
    ) {
        this.genericValidator = new GenericValidator({
            passportNo: {
                required: 'This field is required',
            } ,
            passportIssuedPlace: {
                required: 'This field is Required'
            }
        });
    }

    status = [
        {key: 1, value: 'Active'},
        {key: 2, value: 'Inactive'},
    ];

  ngOnInit() {
      this.initForm();
  }
  private initForm() {
      this.passportDetailsForm = this.fb.group({
          id: 0,
          empCode: null,
          passportNo: [null, Validators.required],
          passportIssuedPlace: [null, Validators.required],
          passportExpireDate: null,
          visaIssuedDate: null,
          visaDetails: null,
          visaExpireDate: null,
          status: 'Active'
      });
      this.passportDetailsForm.valueChanges
      .subscribe(_ => this.dialogRef.disableClose = this.passportDetailsForm.invalid || this.passportDetailsForm.dirty);
  }

  private patchForm(p: any) {
      this.passportDetailsForm.patchValue({
          id: p.id,
          empCode: p.empCode,
          passportNo: p.passportNo,
          passportIssuedPlace: p.passportIssuedPlace,
          passportExpireDate: p.passportExpireDate,
          visaIssuedDate: p.visaIssuedDate,
          visaDetails: p.visaDetails,
          visaExpireDate: p.visaExpireDate,
          status: p.status,
      });

  }

  saveChanges() {
    const errorMessage = validateBeforeSubmit(this.passportDetailsForm);
    if (errorMessage) {return false; }
    this.isWorking = true;
      this.passportService.addOrUpdate(this.passportDetailsForm.value)
      .pipe(takeUntil(this.toDestroy$), delay(1500))
      .subscribe(res => {
          this.dialogRef.close(res);
          this.isWorking = true;
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
      this.genericValidator.initValidationProcess(this.passportDetailsForm, this.formInputElement)
      .subscribe(m => this.displayMessage = m);
      if (this.data.id > 0) {
          this.passportService.getListById(this.data.id)
          .pipe(takeUntil(this.toDestroy$), delay(600))
          .subscribe(res => {
              this.cdr.markForCheck();
              const p: any = res;
              this.patchForm(p);
          });
      }
  }
  cancel() {
      if (this.passportDetailsForm.dirty) {
          this.dialog.open(ChangesConfirmComponent)
          .afterClosed()
          .pipe(filter( _ => _))
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
