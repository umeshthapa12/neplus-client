import { Component, OnInit, ViewChildren, ElementRef, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { fadeIn, GenericValidator, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { EmploymentResourceService } from './employment-resource.service';

@Component({
    templateUrl: './employment-resource-form.component.html',
    styleUrls: ['../employee-management/employee.scss'],
    animations: [fadeIn]
})
export class EmploymentResourceFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    employmentResourceForm: FormGroup;

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    status: any[] = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Rejected' },
    ];

    fiscalYear: any[] = [
        { key: 1, value: '77/78' }
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<EmploymentResourceFormComponent>,
        private assetIssueService: EmploymentResourceService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.employmentResourceForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            status: 'Active'
        });


        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.employmentResourceForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.employmentResourceForm.dirty || this.employmentResourceForm.invalid]);
    }

    private patchForm(d: any) {
        this.employmentResourceForm.patchValue({
            id: d.id,
            name: d.name,
            status: d.status
        });
    }

    saveChanges() {
        console.log(this.employmentResourceForm.value);
        const errorMessage = validateBeforeSubmit(this.employmentResourceForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.assetIssueService.addOrUpdate(this.employmentResourceForm.value)
            // this.iService.addOrUpdate(this.iForm.value)
            .pipe(
                takeUntil(this.toDestroy$),
                delay(1500))
            .subscribe(res => {
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

    cancel() {
        if (this.employmentResourceForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(
                    filter(_ => _)
                ).subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    ngAfterViewInit() {

        this.genericValidator
            .initValidationProcess(this.employmentResourceForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.assetIssueService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                const d: any = r;
                this.patchForm(d);
            });
        }

    }

    /** Resets error state values */
    clearErrors() {
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
