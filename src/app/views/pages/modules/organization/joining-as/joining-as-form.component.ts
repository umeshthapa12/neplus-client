import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangesConfirmComponent } from './../../../../shared';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { JoiningAsService } from './joining-as.service';

@Component({
    templateUrl: './joining-as-form.component.html',
  styleUrls: ['./joining-as.component.scss']
})
export class JoiningAsFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private toDestroy$ = new Subject<void>();
    joiningForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    genericValidator: GenericValidator;
    isError: boolean;
    errors: any[];
    @ViewChildren(FormControlName, {read: ElementRef})
    private formInputElement: ElementRef[];
  constructor(private cdr: ChangeDetectorRef,
              private fb: FormBuilder,
              private joiningService: JoiningAsService,
              private dialog: MatDialog,
              private dialogRef: MatDialogRef<JoiningAsFormComponent>,
              @Inject(MAT_DIALOG_DATA)
            public data: {id: number}
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This Field must be Required'
            }
        });
    }

    status = [
        {key: 1, value: 'Active'},
        {key: 2, value: 'Inactive'},
        {key: 3, value: 'Pending'},
        {key: 4, value: 'Approve'}
    ];

  ngOnInit() {
      this.initForm();
  }
  initForm() {
      this.joiningForm = this.fb.group({
          id: 0,
          name: [null, Validators.required],
          nameNepali: null,
          status: 'Active'
      });
      this.joiningForm.valueChanges
      .subscribe(_ => [this.dialogRef.disableClose = this.joiningForm.dirty || this.joiningForm.invalid]);
  }

  saveChanges() {
      const errorMeaasge = validateBeforeSubmit(this.joiningForm);
      if (errorMeaasge) {return false; }
      this.isWorking = true;

      this.joiningService.addOrUpdate(this.joiningForm.value)
      .pipe(takeUntil(this.toDestroy$), delay(1500))
      .subscribe(res => {
          this.dialogRef.close(res);
          this.isWorking = false;
      }, e => {
          this.cdr.markForCheck();
          this.isWorking = false;
          this.isError = true;
          const model: ResponseModel =  e.error;
          const errors: ErrorCollection[] = model.contentBody.errors;

          if (errors && errors.length > 0) {
            this.errors = errors;
            this.displayMessage = model.messageBody;
          }
      });
  }


   private patchForm(j: any) {
       this.joiningForm.patchValue({
           id: j.id,
           name: j.name,
           nameNepali: j.nameNepali,
           status: j.status,
       });
   }

   ngAfterViewInit() {
       this.genericValidator
       .initValidationProcess(this.joiningForm, this.formInputElement)
       .subscribe({next: m => this.displayMessage = m});
       if (this.data.id > 0) {
           this.joiningService.getListById(this.data.id)
           .pipe(takeUntil(this.toDestroy$), delay(600))
           .subscribe(res => {
               this.cdr.markForCheck();
               const j: any = res;
               this.patchForm(j);
           });
       }
   }
  cancel() {
      if (this.joiningForm.dirty) {
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
