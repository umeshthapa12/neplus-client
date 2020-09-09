import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { GenericValidator, validateBeforeSubmit, fadeIn, fadeInOutStagger } from '../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { LetterTypeService } from './letter-type.service';


@Component({
    templateUrl: './letter-type-form.component.html',
    animations: [fadeIn, fadeInOutStagger],
    styleUrls: ['./letter-type.component.css']
})
export class LetterTypeFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    letterTypeForm: FormGroup;
    responseMessage: string;
    isWorking: boolean;
    displayMessage: any;
    isError: boolean;
    genericValidator: GenericValidator;
    errors: ErrorCollection[];
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];



    constructor(private dialog: MatDialog,
                private dialogRef: MatDialogRef<LetterTypeFormComponent>,
                private letterTypeSevice: LetterTypeService,
                private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA)
        public data: { id: number }) {
        this.genericValidator = new GenericValidator({
            name: {
                required: ' Name must be Required'
            },
        });
    }


    status: any[] = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
    ];

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.letterTypeForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            status: 'Active',
        });
        this.letterTypeForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.letterTypeForm.dirty || this.letterTypeForm.invalid]);
    }

    private patchForm(d) {
        this.cdr.markForCheck();
        this.letterTypeForm.patchValue({
            id: d.id,
            name: d.name,
            status: d.status,

        });

    }



    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.letterTypeForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        this.isWorking = true;

        if (this.data.id > -1) {
            this.letterTypeSevice.update(this.letterTypeForm.value)
                .pipe(
                    takeUntil(this.toDestroy$),
                    delay(1500))
                .subscribe(res => {
                    console.log(res);
                    this.dialogRef.close(res);
                    this.isWorking = false;
                }, e => {
                    this.cdr.markForCheck();
                    this.isError = true;
                    this.isWorking = false;
                    const model: ResponseModel = e.error;
                    const errors: ErrorCollection[] = model.contentBody.errors;

                    // Check if server returning number of error list, if so make these as string
                    if (errors && errors.length > 0) {
                        this.errors = errors;
                        this.responseMessage = model.messageBody;
                    }
                });
        } else {
            this.letterTypeSevice.add(this.letterTypeForm.value)
                .pipe(
                    takeUntil(this.toDestroy$),
                    delay(1500))
                .subscribe(res => {
                    // console.log(res);
                    this.dialogRef.close(res);
                    this.isWorking = false;
                }, e => {
                    this.cdr.markForCheck();
                    this.isError = true;
                    this.isWorking = false;
                    const model: ResponseModel = e.error;
                    const errors: ErrorCollection[] = model.contentBody.errors;

                    // Check if server returning number of error list, if so make these as string
                    if (errors && errors.length > 0) {
                        this.errors = errors;
                        this.responseMessage = model.messageBody;
                    }
                });
        }
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.letterTypeForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.letterTypeSevice.getListById(this.data.id).subscribe({
                next: res => {
                    const d = res;
                    this.patchForm(d);
                }
            });
        }
    }


    cancel() {
        if (this.letterTypeForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }
    clearErrors() {
        this.isError = false;
        this.errors = null;
        this.responseMessage = null;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
