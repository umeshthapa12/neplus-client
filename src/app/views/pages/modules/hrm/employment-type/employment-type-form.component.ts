import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { EmploymentTypeService } from './employment-type.service';

@Component({
    templateUrl: './employment-type-form.component.html',
    styleUrls: ['./employment-type.component.scss']
})
export class EmploymentTypeFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    employmentTypeForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    show: boolean;
    isGrade: string;

    constructor(private cdr: ChangeDetectorRef,
                private fb: FormBuilder,
                private employmentTypeService: EmploymentTypeService,
                private dialogRef: MatDialogRef<EmploymentTypeFormComponent>,
                private dialog: MatDialog,
                @Inject(MAT_DIALOG_DATA)
                public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name Must Be required'
            },
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Approve' },
        { key: 4, value: 'Pending' },
    ];


    onChange() {
        // this.show = !this.show;
        // if (this.show === true) {
        //     this.isGrade = true;
        //     console.log(this.isGrade);

        // } else  {
        //     this.isGrade = 'No';
        //     console.log(this.isGrade);
        // }

    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.employmentTypeForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            isGrade: false,
            isGratuity: false,
            status: 'Active'
        });
        this.employmentTypeForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.employmentTypeForm.invalid || this.employmentTypeForm.dirty]);
    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.employmentTypeForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.employmentTypeService.addOrUpdate(this.employmentTypeForm.value)
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

    private patchForm(e: any) {
        this.employmentTypeForm.patchValue({
            id: e.id,
            name: e.name,
            nameNepali: e.nameNepali,
            isGrade: e.isGrade,
            isGratuity: e.isGratuity,
            status: e.status,
        });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.employmentTypeForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.employmentTypeService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const e: any = res;
                    this.patchForm(e);
                });
        }
    }
    cancel() {
        if (this.employmentTypeForm.dirty) {
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
