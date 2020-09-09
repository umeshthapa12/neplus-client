import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GradeService } from './grade.service';

@Component({
  templateUrl: './grade-form.component.html',
  styleUrls: ['./grade.component.scss']
})
export class GradeFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    gradeForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    genericValidator: GenericValidator;
    errors: any[];
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElements: ElementRef[];

  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private gradeService: GradeService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<GradeFormComponent>,
              @Inject(MAT_DIALOG_DATA)
            public data: any,
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This is the required Field'
            }
        });
    }

    status: any[] = [
        {key: 1, value: 'Active'},
        {key: 2, value: 'Inactive'},
        {key: 3, value: 'Pending'},
        {key: 4, value: 'Approved'},
    ];

  ngOnInit() {
      this.initForm();
  }

   private initForm() {
      this.gradeForm = this.fb.group({
          id: 0,
          name: [null, Validators.required],
          nameNepali: null,
          status: 'Active'
      });
      this.gradeForm.valueChanges
      .pipe(takeUntil(this.toDestroy$))
      .subscribe(_ => [this.dialogRef.disableClose = this.gradeForm.dirty || this.gradeForm.invalid]);
  }

  private patchForm(g: any) {
      this.gradeForm.patchValue({
          id: g.id,
          name: g.name,
          nameNepali: g.nameNepali,
          status: g.status,
      });
  }
  saveChanges() {
      const errorMessage = validateBeforeSubmit(this.gradeForm);
      if (errorMessage) {return true; }
      this.isWorking = true;

      this.gradeService.addOrUpdate(this.gradeForm.value)
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

        if (errors && errors.length > 0) {
            this.errors = errors;
            this.displayMessage = model.messageBody;
        }
    });
  }

  ngAfterViewInit() {
    this.genericValidator
    .initValidationProcess(this.gradeForm, this.formInputElements)
    .subscribe({ next: m => this.displayMessage = m });

    if (this.data.id > 0) {
          this.gradeService.getListById(this.data.id)
          .pipe(takeUntil(this.toDestroy$), delay(600))
          .subscribe(res => {
              this.cdr.markForCheck();
              const g: any = res;
              this.patchForm(g);
          });
      }
  }
  cancel() {
      if (this.gradeForm.dirty) {
          this.dialog.open(ChangesConfirmComponent)
          .afterClosed()
          .pipe(filter (_ => _))
          .subscribe(_ => [this.dialogRef.close()]);
      } else {
          this.dialogRef.close();
      }
  }

  ngOnDestroy() {
      this.toDestroy$.next();
      this.toDestroy$.complete();
  }

}
