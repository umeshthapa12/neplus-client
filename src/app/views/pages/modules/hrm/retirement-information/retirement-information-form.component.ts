import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { RetirementInformationService } from './retirement-information.service';

@Component({
  templateUrl: './retirement-information-form.component.html',
  styleUrls: ['./retirement-information.component.scss']
})
export class RetirementInformationFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    retirementInformationForm: FormGroup;
    isWorking: boolean;
    displayMessage: any = {};
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElement: ElementRef[];
  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private retirementService: RetirementInformationService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<RetirementInformationFormComponent>,
              @Inject(MAT_DIALOG_DATA)
                public data: {id: number},
    ) {
        this.genericValidator = new GenericValidator({
            gratuityAmount: {
                // required: 'This is Required Field',
                pattern: 'Invalid Number',
            }
        });
     }
     branches = [
         {key: 1, value: 'Kathmandu'},
         {key: 2, value: 'Bhaktapur'},
         {key: 3, value: 'Chitwan'},
         {key: 4, value: 'Kaski'}
     ];

     designation = [
         {key: 1, value: 'Manager'},
         {key: 2, value: 'CEO'},
         {key: 3, value: 'Supervisor'},
         {key: 4, value: 'others'},
     ];

     positions = [
         {key: 1, value: 'Top-Level'},
         {key: 2, value: 'Manager'},
     ];

     retirements = [
         {key: 1, value: 'Regular'},
         {key: 2, value: 'Disability'},
         {key: 3, value: 'permanent'},
     ];

     status = [
         {key: 1, value: 'Active'},
         {key: 2, value: 'Inactive'}
     ];



  ngOnInit() {
      this.initForm();
  }

  private initForm() {
      this.retirementInformationForm = this.fb.group({
          id: 0,
          empCode: null,
          level: null,
          designation: null,
          branch: null,
          letterNumber: null,
          letterDate: null,
          letterDateNepali: null,
          retirementDate: null,
          retirementDateNepali: null,
          retirementType: null,
          pensionAmount: null,
          pensionPeriod: null,
          gratuityAmount: [null, [ Validators.pattern('^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$')]],
          ageOnRetirement: null,
          servicePeriod: null,
          status: 'Action',
          description: null,
      });
      this.retirementInformationForm.valueChanges
      .subscribe(_ => [this.dialogRef.disableClose = this.retirementInformationForm.invalid || this.retirementInformationForm.dirty]);
  }
saveChanges() {
    const errorMessage = validateBeforeSubmit(this.retirementInformationForm);
    if (errorMessage) {return false; }
    this.isWorking = true;
    this.retirementService.addOrUpdate(this.retirementInformationForm.value)
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

private patchForm(r: any) {
    this.retirementInformationForm.patchValue({
        id: r.id,
        empCode: r.empCode,
        level: r.level,
        designation: r.designation,
        branch: r.branch,
        letterNumber: r.letterNumber,
        letterDate: r.letterDate,
        letterDateNepali: r.letterDateNepali,
        retirementDate: r.retirementDate,
        retirementDateNepali: r.retirementDateNepali,
        retirementType: r.retirementType,
        pensionAmount: r.pensionAmount,
        pensionPeriod: r.pensionPeriod,
        gratuityAmount: r.gratuityAmount,
        ageOnRetirement: r.ageOnRetirement,
        servicePeriod: r.servicePeriod,
        status: r.status,
        description: r.description,
    });
}

ngAfterViewInit() {
    this.genericValidator
    .initValidationProcess(this.retirementInformationForm, this.formInputElement)
    .subscribe({next: m => this.displayMessage = m});
    if (this.data.id > 0) {
        this.retirementService.getListById(this.data.id)
        .pipe(takeUntil(this.toDestroy$), delay(600))
        .subscribe(res => {
            this.cdr.markForCheck();
            const r: any = res;
            this.patchForm(r);
        });
    }
}
cancel() {
    if (this.retirementInformationForm.dirty) {
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
