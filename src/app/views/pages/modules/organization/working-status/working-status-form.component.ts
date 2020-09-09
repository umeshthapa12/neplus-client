import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { WorkingStatusService } from './working-status.service';

@Component({
  templateUrl: './working-status-form.component.html',
  styleUrls: ['./working-status.component.scss']
})
export class WorkingStatusFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    workingStatusForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];

  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<WorkingStatusFormComponent>,
              private workingStatusService: WorkingStatusService,
              @Inject(MAT_DIALOG_DATA)
             public data: {id: number},
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must be required'
            }
        });
    }

    status = [
        {key: 1, value: 'Active'},
        {key: 2, value: 'Inactive'},
        {key: 3, value: 'Pending'},
        {key: 4, value: 'Approve'},
    ];

  ngOnInit() {
      this.initForm();
  }

  private initForm() {
      this.workingStatusForm = this.fb.group({
          id: 0,
          name: [null, Validators.required],
          nameNepali: null,
          status: 'Active',
      });
      this.workingStatusForm.valueChanges
      .subscribe(_ => [this.dialogRef.disableClose = this.workingStatusForm.invalid || this.workingStatusForm.dirty]);
  }
saveChanges() {
    const errorMessage = validateBeforeSubmit(this.workingStatusForm);
    if (errorMessage) {return false; }
    this.isWorking = true;
    this.workingStatusService.addOrUpdate(this.workingStatusForm.value)
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

private patchForm(w: any) {
    this.workingStatusForm.patchValue({
        id: w.id,
        name: w.name,
        nameNepali: w.nameNepali,
        status: w.status,
    });
}

ngAfterViewInit() {
    this.genericValidator
    .initValidationProcess(this.workingStatusForm, this.formInputElement)
    .subscribe({next: m => this.displayMessage = m});
    if (this.data.id > 0) {
        this.workingStatusService.getListById(this.data.id)
        .pipe(takeUntil(this.toDestroy$), delay(600))
        .subscribe(res => {
            this.cdr.markForCheck();
            const w: any = res;
            this.patchForm(w);
        });
    }
}

cancel() {
    if (this.workingStatusForm.dirty) {
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
