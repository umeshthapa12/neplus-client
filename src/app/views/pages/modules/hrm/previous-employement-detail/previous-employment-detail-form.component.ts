import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { ChangesConfirmComponent } from './../../../../shared';
import { ErrorCollection, ResponseModel } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { PreviousEmploymentDetailService } from './previous-employment-detail.service';

@Component({
    templateUrl: './previous-employment-detail-form.component.html',
    styleUrls: ['./previous-employement-detail.component.scss']
})
export class PreviousEmploymentDetailFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    previousEmploymentForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElemnet: ElementRef[];
    genericValidator: GenericValidator;
    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<PreviousEmploymentDetailFormComponent>,
        private previousEmploymentService: PreviousEmploymentDetailService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            organization: {
                required: 'This is required Field'
            },
        });
    }

    level = [
        { key: 1, value: 'Manager' },
        { key: 2, value: 'Helper' },
        { key: 3, value: 'Director' },
        { key: 4, value: 'Employee' },
    ];

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Approve' }
    ];

    ngOnInit() {
        this.initForm();
        console.log(this.data);
    }

    private initForm() {
        this.previousEmploymentForm = this.fb.group({
            id: 0,
            empCode: null,
            organization: [null, Validators.required],
            employeeLevel: null,
            dateFrom: null,
            dateFromNepali: null,
            dateTo: null,
            dateToNepali: null,
            status: 'Active',
            description: '',
        });
        this.previousEmploymentForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.previousEmploymentForm.invalid || this.previousEmploymentForm.dirty]);
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.previousEmploymentForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.previousEmploymentService.addOrUpdate(this.previousEmploymentForm.value)
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
    private patchForm(p: any) {
        this.previousEmploymentForm.patchValue({
            id: p.id,
            empCode: p.empCode,
            organization: p.organization,
            employeeLevel: p.employeeLevel,
            dateFrom: p.dateFrom,
            dateFromNepali: p.dateFromNepali,
            dateTo: p.dateTo,
            dateToNepali: p.dateToNepali,
            description: p.description,
            status: p.status,
        });
    }
    ngAfterViewInit() {
        this.genericValidator.initValidationProcess(this.previousEmploymentForm, this.formInputElemnet)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.previousEmploymentService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const p: any = res;
                    this.patchForm(p);
                });
        }
    }
    cancel() {
        if (this.previousEmploymentForm.dirty) {
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
