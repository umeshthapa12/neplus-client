import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { LoanTakenHistoryService } from './loan-taken-history.service';

@Component({
  templateUrl: './loan-taken-history-form.component.html',
  styleUrls: ['./loan-taken-history.component.scss']
})
export class LoanTakenHistoryFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    loanTakenHistoryForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    displayMessage: any = {};
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElement: ElementRef[];

  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private loanTakenService: LoanTakenHistoryService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<LoanTakenHistoryFormComponent>,
              @Inject(MAT_DIALOG_DATA)
                public data: {id: number},
    ) {
        this.genericValidator = new GenericValidator({
            loanAmount: {
                pattern: 'Not Valid Number..'
            }
        });
     }

  status = [
      {key: 1, value: 'Active'},
      {key: 2, value: 'Inactive'},
      {key: 3, value: 'Approve'},
      {key: 4, value: 'Pending'},
  ];

  ngOnInit() {
      this.initDate();
  }

  private initDate() {
    this.loanTakenHistoryForm = this.fb.group({
        id: 0,
        empCode: null,
        loan: null,
        takenDate: null,
        takenDateNepali: null,
        dueDate: null,
        dueDateNepali: null,
        loanClearStatus: null,
        clearDate: null,
        clearDateNepali: null,
        loanAmount: [null, [ Validators.pattern('^[-+]?[0-9]+[.]?[0-9]*([eE][-+]?[0-9]+)?$')]],
        status: 'Active',
        description: null,
    });
    this.loanTakenHistoryForm.valueChanges
    .subscribe(_ => [this.dialogRef.disableClose = this.loanTakenHistoryForm.invalid || this.loanTakenHistoryForm.dirty]);
  }
private patchForm(l: any) {
    this.loanTakenHistoryForm.patchValue({
        id: l.id,
        empCode: l.empCode,
        loan: l.loan,
        takenDate: l.takenDate,
        takenDateNepali: l.takenDateNepali,
        dueDate: l.dueDate,
        dueDateNepali: l.dueDateNepali,
        loanClearStatus: l.loanClearStatus,
        clearDate: l.clearDate,
        clearDateNepali: l.clearDateNepali,
        loanAmount: l.loanAmount,
        status: l.status,
        description: l.description
    });
}

saveChanges() {
    const erroMessage = validateBeforeSubmit(this.loanTakenHistoryForm);
    if (erroMessage) {return false; }
    this.isWorking = true;
    this.loanTakenService.addOrUpdate(this.loanTakenHistoryForm.value)
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
    this.genericValidator.initValidationProcess(this.loanTakenHistoryForm, this.formInputElement)
    .subscribe({next: m => this.displayMessage = m});
    if (this.data.id > 0) {
this.loanTakenService.getListById(this.data.id)
.pipe(takeUntil(this.toDestroy$), delay(600))
.subscribe(res => {
    this.cdr.markForCheck();
    const l: any = res;
    this.patchForm(l);
});
    }
}

cancel() {
    if (this.loanTakenHistoryForm.dirty) {
        this.dialog.open(ChangesConfirmComponent)
        .afterClosed()
        .pipe((filter(_ => _ )))
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
