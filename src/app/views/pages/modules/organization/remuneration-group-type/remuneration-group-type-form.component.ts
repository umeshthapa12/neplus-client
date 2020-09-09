import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { ChangesConfirmComponent } from './../../../../shared';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { RemunerationGroupTypeService } from './remuneration-group-type.service';


@Component({
  templateUrl: './remuneration-group-type-form.component.html',
  styleUrls: ['./remuneration-group-type.component.scss']
})
export class RemunerationGroupTypeFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private toDestroy$ = new Subject<void>();
    remunerationGroupTypeForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    errors: any = [];
    isError: boolean;
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef})
    private formInputElement: ElementRef[];

  constructor(private fb: FormBuilder,
              private cdr: ChangeDetectorRef,
              private remunerationTypeService: RemunerationGroupTypeService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<RemunerationGroupTypeFormComponent>,
              @Inject(MAT_DIALOG_DATA)
            public data: {id: number}
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name Must be Required'
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
      this.initForm();
  }

  private initForm() {
      this.remunerationGroupTypeForm = this.fb.group({
          id: 0,
          name: [null, Validators.required],
          nameNepali: null,
          status: 'Active'
      });
      this.remunerationGroupTypeForm.valueChanges
      .subscribe(_ => [this.dialogRef.disableClose = this.remunerationGroupTypeForm.invalid || this.remunerationGroupTypeForm.dirty]);
  }
  saveChanges() {
     const errorMessage = validateBeforeSubmit(this.remunerationGroupTypeForm);
     if (errorMessage) {return false; }
     this.isWorking = true;
     this.remunerationTypeService.addOrUpdate(this.remunerationGroupTypeForm.value)
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

  private patchForm(r: any) {
      this.remunerationGroupTypeForm.patchValue({
          id: r.id,
          name: r.name,
          nameNepali: r.nameNepali,
          status: r.status,
      });
  }

  ngAfterViewInit() {
      this.genericValidator
      .initValidationProcess(this.remunerationGroupTypeForm, this.formInputElement)
      .subscribe({next: m => this.displayMessage = m});
      if (this.data.id > 0) {
          this.remunerationTypeService.getListById(this.data.id)
          .pipe(takeUntil(this.toDestroy$),
          delay(600))
          .subscribe(res => {
              this.cdr.markForCheck();
              const r: any = res;
              this.patchForm(r);
          });
      }
  }
  cancel() {
      if (this.remunerationGroupTypeForm.dirty) {
          this.dialog.open(ChangesConfirmComponent)
          .afterClosed()
          .pipe(takeUntil(this.toDestroy$),
          filter(_ => _))
          .subscribe(_ => this.dialogRef.close());
      } else {
          this.dialogRef.close();
      }
  }
ngOnDestroy() {
    this.toDestroy$.next();
    this.toDestroy$.next();
}

}
