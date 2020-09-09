import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChildren, ElementRef, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { GenericValidator, fadeIn, validateBeforeSubmit } from '../../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../../src/app/models';
import { EducationDetailsService } from './education-details.service';

@Component({
    templateUrl: './education-details-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class EducationDetailsFormComponent implements OnInit, AfterViewInit, OnDestroy {

    private readonly toDestroy$ = new Subject<void>();

    educationForm: FormGroup;
    startDate = new Date(1990, 0, 1);

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<EducationDetailsFormComponent>,
        private eduService: EducationDetailsService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            institution: {
                required: 'This Field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.educationForm = this.fb.group({
            id: null,
            empCode: null,
            degreeName: null,
            institution: null,
            country: null,
            startYear: null,
            passedYear: null,
            majorSubject: null,
            duration: null,
            university: null,
            grade: null,
            highestDegree: null,
            status: 'Active'
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.educationForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.educationForm.dirty || this.educationForm.invalid]);
    }

    private patchForm(d: any) {
        this.educationForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            degreeName: d.degreeName,
            institution: d.institution,
            country: d.country,
            startYear: d.startYear,
            passedYear: d.passedYear,
            majorSubject: d.majorSubject,
            duration: d.duration,
            university: d.university,
            grade: d.grade,
            highestDegree: d.highestDegree,
            status: d.status
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.educationForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.eduService.addOrUpdate(this.educationForm.value)
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
        if (this.educationForm.dirty) {
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
            .initValidationProcess(this.educationForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.employeeService.getEmployeeById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }

        if (this.data.id > 0) {
            this.eduService.getEduById(this.data.id).pipe(
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
