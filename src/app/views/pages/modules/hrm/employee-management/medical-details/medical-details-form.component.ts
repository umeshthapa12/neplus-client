import { Component, OnInit, ViewChildren, ElementRef, ChangeDetectorRef, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControlName, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { fadeIn, GenericValidator, validateBeforeSubmit } from '../../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../../src/app/models';
import { MedicalDetailsService } from './medical-details.service';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './medical-details-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class MedicalDetailsFormComponent implements OnInit, AfterViewInit, OnDestroy {

    private readonly toDestroy$ = new Subject<void>();

    medicalDetailsForm: FormGroup;

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

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<MedicalDetailsFormComponent>,
        private medicalDetailsService: MedicalDetailsService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({

        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.medicalDetailsForm = this.fb.group({
            id: 0,
            empCode: null,
            medicalDate: null,
            medicalValue: null,
            description: null,
            status: 'Active'
        });


        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.medicalDetailsForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.medicalDetailsForm.dirty || this.medicalDetailsForm.invalid]);
    }

    private patchForm(d: any) {
        this.medicalDetailsForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            medicalDate: d.medicalDate,
            medicalValue: d.medicalValue,
            description: d.description,
            status: d.status
        });
    }

    saveChanges() {
        console.log(this.medicalDetailsForm.value);
        const errorMessage = validateBeforeSubmit(this.medicalDetailsForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.medicalDetailsService.addOrUpdate(this.medicalDetailsForm.value)
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
        if (this.medicalDetailsForm.dirty) {
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
            .initValidationProcess(this.medicalDetailsForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.medicalDetailsService.getListById(this.data.id).pipe(
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
