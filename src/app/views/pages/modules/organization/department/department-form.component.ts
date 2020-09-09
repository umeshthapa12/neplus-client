import { GenericValidator, validateBeforeSubmit } from './../../../../../utils/validations/generic-validators';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControlName, FormControl } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, isDevMode, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { DepartmentService } from './department.service';

@Component({
  templateUrl: './department-form.component.html',
  styleUrls: ['./department.component.scss']
})
export class DepartmentFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    departmentForm: FormGroup;
    displayMessage: any = {};
    responseMessage: string;
    isWorking: boolean;
    private genericValidator: GenericValidator;
    isError: boolean;
    errors: any[];
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElements: ElementRef[];
  constructor(private fb: FormBuilder,
              private departmentService: DepartmentService,
              private cdr: ChangeDetectorRef,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<DepartmentFormComponent>,
              @Inject(MAT_DIALOG_DATA)
              public data: any
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This is the required Field',
            }
        });
    }

    departments = [
        {key: 1, value: 'Manufacturing'},
        {key: 2, value: 'Shaling'},
        {key: 3, value: 'Production'},
        {key: 4, value: 'Delivery'}
    ];
public departmentCtrl: FormControl = new FormControl();
     /** control for the MatSelect filter keyword */
  public departmentFilterCtrl: FormControl = new FormControl();

  ngOnInit() {
      this.initForm();
  }

  private initForm() {
      this.departmentForm = this.fb.group({
          id: 0,
          name: [null, Validators.required],
          nameNepali: null,
          parentDepartment: null,
          status: 'Active'
      });
      this.departmentForm.valueChanges.pipe(
          takeUntil(this.toDestroy$))
          .subscribe(_ => [this.dialogRef.disableClose = this.departmentForm.dirty || this.departmentForm.invalid]);
  }

  private patchForm(d: any) {
      this.departmentForm.patchValue({
          id: d.id,
          name: d.name,
          nameNepali: d.nameNepali,
          parentDepartment: d.parentDepartment,
          status: d.status,
      });
  }
  saveChanges() {

    const errorMessage = validateBeforeSubmit(this.departmentForm);
    if (errorMessage) {return false; }
    this.isWorking = true;

    this.departmentService.addOrUpdate(this.departmentForm.value)
    .pipe(takeUntil(this.toDestroy$),
    delay(1500))
    .subscribe(res => {
        this.dialogRef.close(res);
        this.isWorking = false;
    }, e => {
        this.cdr.markForCheck();
        this.isError =  true;
        this.isWorking = false;
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
    .initValidationProcess(this.departmentForm, this.formInputElements)
    .subscribe({next: m => this.displayMessage = m});
    if (this.data.id > 0) {
        this.departmentService.getListById(this.data.id)
        .pipe(takeUntil(this.toDestroy$),
        delay(500))
        .subscribe(res => {
            const d: any = res;
            this.patchForm(d);
        });
    }
}


cancel() {
    if (this.departmentForm.dirty) {
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
