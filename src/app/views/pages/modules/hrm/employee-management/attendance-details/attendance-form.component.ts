import { Component, OnInit, ViewChildren, ElementRef, Inject, ChangeDetectorRef, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControlName, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { ErrorCollection, ResponseModel } from '../../../../../../../../src/app/models';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { AttendanceService } from './attendance.service';
import { fadeIn, GenericValidator, validateBeforeSubmit } from '../../../../../../../../src/app/utils';

@Component({
    templateUrl: './attendance-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class AttendanceFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    attendanceForm: FormGroup;

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
        private dialogRef: MatDialogRef<AttendanceFormComponent>,
        private salaryService: AttendanceService,
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
        this.attendanceForm = this.fb.group({
            id: 0,
            empCode: null,
            status: 'Active'
        });


        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.attendanceForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.attendanceForm.dirty || this.attendanceForm.invalid]);
    }

    private patchForm(d: any) {
        this.attendanceForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            status: d.status
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.attendanceForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.salaryService.addOrUpdate(this.attendanceForm.value)
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
        if (this.attendanceForm.dirty) {
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
            .initValidationProcess(this.attendanceForm, this.formInputElements)
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
