import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormControlName, FormBuilder } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { ErrorCollection, ResponseModel } from '../../../../../../../../src/app/models';
import { GenericValidator, validateBeforeSubmit, fadeIn } from '../../../../../../../../src/app/utils';
import { SalaryService } from './salary.service';

@Component({
    templateUrl: './salary-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class SalaryFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    salaryForm: FormGroup;

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    calculations: any[] = [
        { key: 1, value: 'System Design' }
    ];
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
        private dialogRef: MatDialogRef<SalaryFormComponent>,
        private salaryService: SalaryService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            empCode: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.salaryForm = this.fb.group({
            id: 0,
            empCode: null,
            natureOfCalculation: null,
            effectByWorkingDays: null,
            calculationRate: null,
            effectDateFrom: null,
            effectDateTo: null,
            isCurrentHead: null,
            formula: null,
            amount: null,
            actualValue: null,
            description: null,
            status: 'Active'
        });


        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.salaryForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.salaryForm.dirty || this.salaryForm.invalid]);
    }

    private patchForm(d: any) {
        this.salaryForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            natureOfCalculation: d.natureOfCalculation,
            effectByWorkingDays: d.effectByWorkingDays,
            calculationRate: d.calculationRate,
            effectDateFrom: d.effectDateFrom,
            effectDateTo: d.effectDateTo,
            isCurrentHead: d.isCurrentHead,
            formula: d.formula,
            amount: d.amount,
            actualValue: d.actualValue,
            description: d.description,
            status: d.status
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.salaryForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.salaryService.addOrUpdate(this.salaryForm.value)
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
        if (this.salaryForm.dirty) {
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
            .initValidationProcess(this.salaryForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.salaryService.getListById(this.data.id).pipe(
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
