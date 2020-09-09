import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit, ViewChildren, ElementRef, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, fadeIn, validateBeforeSubmit } from './../../../../../utils/';
import { NomineeInformationService } from './nominee-information.service';

@Component({
  templateUrl: './nominee-information-form.component.html',
  styleUrls: ['./nominee-information.component.scss'],
  animations: [fadeIn]
})
export class NomineeInformationFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    nomineeInfoForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    responseMessage: string;
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElement: ElementRef[];

  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private nomineeService: NomineeInformationService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<NomineeInformationFormComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: {id: number}
              ) {
                  this.genericValidator = new GenericValidator({
                      name: {
                          required: 'This is required field',
                      },
                      permanentAddress: {
                          required: 'This is required field',
                      } ,
                      currentAddress: {
                          required: 'This is required field',
                      },
                      relation: {
                          required: 'This is required field'
                      },
                      mobileNumber: {
                        minLength: 'Atleast 10 digit required',
                        pattern: 'Please enter Valid number',
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
    this.nomineeInfoForm = this.fb.group({
        id: 0,
        empCode: null,
        name: [null, Validators.required],
        permanentAddress: [null, Validators.required],
        currentAddress: [null, Validators.required],
        relation: [null, Validators.required],
        age: null,
        mobileNumber: [null, [ Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$'), Validators.minLength(10)]],
        status: 'Active'
    });
    this.nomineeInfoForm.valueChanges
    .subscribe(_ => [this.dialogRef.disableClose = this.nomineeInfoForm.invalid || this.nomineeInfoForm.dirty]);
}

private patchForm(n: any) {
    this.nomineeInfoForm.patchValue({
        id: n.id,
        empCode: n.empCode,
        name: n.name,
        permanentAddress: n.permanentAddress,
        currentAddress: n.currentAddress,
        relation: n.relation,
        age: n.age,
        mobileNumber: n.mobileNumber,
        status: n.status,
    });
}

  saveChanges() {
      const errroMessage = validateBeforeSubmit(this.nomineeInfoForm, document.querySelector('#res-message'));
      this.isError = errroMessage && errroMessage.length > 0;
      this.responseMessage = errroMessage;
      if (errroMessage) { return false; }
      this.isWorking = true;
      this.nomineeService.addOrUpdate(this.nomineeInfoForm.value)
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
      this.genericValidator.initValidationProcess(this.nomineeInfoForm, this.formInputElement)
      .subscribe(m => this.displayMessage = m);
      if (this.data.id > 0) {
          this.nomineeService.getListById(this.data.id)
          .pipe(takeUntil(this.toDestroy$), delay(600))
          .subscribe(res => {
              this.cdr.markForCheck();
              const n: any = res;
              this.patchForm(n);
          });
      }
  }
  cancel() {
      if (this.nomineeInfoForm.dirty) {
          this.dialog.open(ChangesConfirmComponent)
          .afterClosed()
          .pipe(filter(_ => _))
          .subscribe(_ => this.dialogRef.close());
      } else {
          this.dialogRef.close();
      }
  }
  clearErrors() {
      this.isError = false;
      this.responseMessage = null;
      this.errors = null;
  }
  ngOnDestroy() {
      this.toDestroy$.next();
      this.toDestroy$.complete();
  }

}
