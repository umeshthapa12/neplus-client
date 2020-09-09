import { ChangesConfirmComponent } from './../../../../shared/changes-confirm/changes-confirm.component';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { fadeIn , GenericValidator, validateBeforeSubmit} from './../../../../../utils';
import { DarbandiService } from './darbandi.service';
import { Subject } from 'rxjs';

@Component({
   templateUrl: './darbandi-form.component.html',
   animations: [fadeIn],
  styleUrls: ['./darbandi.component.scss']
})
export class DarbandiFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    darbandiForm: FormGroup;
    responseMessage: string;
    isWorking: boolean;
    displayMessage: any = {};
    errors: any[];
    isError: boolean;
    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElements: ElementRef[];

  constructor(private fb: FormBuilder,
              private darbandiService: DarbandiService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<DarbandiFormComponent>,
              private cdr: ChangeDetectorRef,
              @Inject(MAT_DIALOG_DATA)
                public data: any,

    ) {
        this.genericValidator = new GenericValidator({
            branch: {
                required: 'This is the Required Field'
            }
        });
     }

    positions = [
        {key: 1, value: 'Manager'},
        {key: 2, value: 'MD'},
        {key: 3, value: 'Bm'},
        {key: 4, value: 'Office Helper'}
    ];

    designations = [
        {key: 1, value: 'x'},
        {key: 2, value: 'y'},
        {key: 3, value: 'z'},
        {key: 4, value: 'A'}
    ];

    departments = [
        {key: 1, value: 'IT'},
        {key: 2, value: 'Account'},
        {key: 3, value: 'Store'},
        {key: 4, value: 'Delivery'}
    ];

    selections = [
        {key: 1, value: 'xyz'},
        {key: 2, value: 'abc'},
        {key: 3, value: 'uvw'},
        {key: 4, value: 'Abc'}
    ];

    status = [
        {key: 1, value: 'Active'},
        {key: 2, value: 'Inactive'},
        {key: 3, value: 'Pending'},
        {key: 4, value: 'Approve'}
    ];

  ngOnInit() {
      this.initForm();
  }

  private initForm() {
      this.darbandiForm = this.fb.group({
          id: 0,
          branch: [null, Validators.required],
          position: null,
          designation: null,
          designationFilter: null,
          department: null,
          section: null,
          removeDate: null,
          removeDateNepali: null,
          noOfDarbandi: null,
          description: null,
          status: 'Active'
      });
      this.darbandiForm.valueChanges.pipe(
          takeUntil(this.toDestroy$)
      ).subscribe(_ => [this.dialogRef.disableClose = this.darbandiForm.dirty || this.darbandiForm.invalid]);
  }
  saveChanges() {
        const errorMessage = validateBeforeSubmit(this.darbandiForm, document.querySelector(`#res-message`));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.darbandiService.addOrUpdate(this.darbandiForm.value)
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
              this.responseMessage = model.messageBody;
          }

      });
  }

  private patchForm(d: any) {
      this.darbandiForm.patchValue({
          id: d.id,
          branch: d.branch,
          position: d.position,
          designation: d.designation,
          department: d.department,
          section: d.section,
          removeDate: d.removeDate,
          removeDateNepali: d.removeDateNepali,
          noOfDarbandi: d.noOfDarbandi,
          description: d.description,
          status: d.status,
      });
  }

  ngAfterViewInit() {
      this.genericValidator
      .initValidationProcess(this.darbandiForm, this.formInputElements)
      .subscribe({ next: m => this.displayMessage = m});
      if (this.data.id > 0) {
          this.darbandiService.getListById(this.data.id)
          .pipe(takeUntil(this.toDestroy$),
          delay(500))
          .subscribe(res => {
              this.cdr.markForCheck();
              const d: any = res;
              this.patchForm(d);
          });
      }
  }
  cancel() {
      if (this.darbandiForm.dirty) {
          this.dialog.open(ChangesConfirmComponent)
          .afterClosed()
          .pipe(filter(_ => _))
          .subscribe(_ => {
              this.dialogRef.close();
          });
      } else {
          this.dialogRef.close();
      }
  }

  ngOnDestroy() {
      this.toDestroy$.next();
      this.toDestroy$.complete();
  }

}
