import { ChangesConfirmComponent } from './../../../../shared/changes-confirm/changes-confirm.component';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, FormControlName, Validator, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { PositionService } from './position.service';

@Component({
  templateUrl: './position-form.component.html',
  styleUrls: ['./position.component.scss']
})
export class PositionFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private toDestroy$ = new Subject<void>();
    positionForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    displayMessage: any = {};
    errors: any[];
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElement: ElementRef[];
    genericValidator: GenericValidator;

  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<PositionFormComponent>,
              private positionService: PositionService,
              @Inject(MAT_DIALOG_DATA)
                 public data: {id: number},
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name Must Be Required',
            }
        });
     }

  status = [
      {key: 1, value: 'Active'},
      {key: 2, value: 'Inactive'}
  ];

  positions = [
      {key: 1, value: 'Product Manager'},
      {key: 2, value: 'Sales Manager'},
      {key: 1, value: 'Employee Manager'},
      {key: 1, value: 'Branch Manager'},
  ];

  ngOnInit() {
      this.initForm();
  }

  private initForm() {
      this.positionForm = this.fb.group({
          id: 0,
          name: [null, Validators.required],
          nameNepali: null,
          maxGradeLimit: null,
          position: null,
          status: 'Active'
      });
      this.positionForm.valueChanges
      .subscribe(_ => [this.dialogRef.disableClose = this.positionForm.dirty || this.positionForm.invalid]);
  }

  private patchForm(p: any) {
      this.positionForm.patchValue({
          id: p.id,
          name: p.name,
          nameNepali: p.nameNepali,
          maxGradeLimit: p.maxGradeLimit,
          position: p.position,
          status: p.status,
      });
  }

  saveChanges() {
      const errorMessage = validateBeforeSubmit(this.positionForm);
      if (errorMessage) { return false; }
      this.isWorking = true;
      this.positionService.addOrUpdate(this.positionForm.value)
    .pipe(takeUntil(this.toDestroy$),
    delay(1500))
    .subscribe(res => {
        this.dialogRef.close(res);
        this.isWorking = false;
    }, e => {
        this.cdr.markForCheck();
        this.isWorking = false;
        this.isError = true;
        const model: ResponseModel = e.error;
        const errors: ErrorCollection[] = model.contentBody.errors;

        if (errors && errors.length > 0 ) {
            this.errors = errors;
            this.displayMessage = model.messageBody;
        }
    });
  }

  ngAfterViewInit() {
    this.genericValidator
    .initValidationProcess(this.positionForm, this.formInputElement)
    .subscribe({next: m => this.displayMessage = m});
    if (this.data.id > 0) {
          this.positionService.getListById(this.data.id)
          .pipe(takeUntil(this.toDestroy$), delay(600))
          .subscribe(res => {
              this.cdr.markForCheck();
              const p: any = res;
              this.patchForm(p);
          });
      }
  }
  cancel() {
      if (this.positionForm.dirty) {
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
