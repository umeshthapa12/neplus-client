import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { AttendanceShiftWorkingService } from './attendance-shift-working.service';


@Component({
    templateUrl: './attendance-shift-working-form.component.html',
    styleUrls: ['../attendance.component.scss']
})
export class AttendanceShiftWorkingFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    shiftWorkingForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];

    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AttendanceShiftWorkingFormComponent>,
        private shiftWorkingService: AttendanceShiftWorkingService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            shiftCode: {
                required: 'This is required field'
            },
            workingDay: {
                required: 'This is required field'
            },

        });
    }

    shiftCodes = [
        { key: 1, value: 'M-456' },
        { key: 2, value: 'E-675' },
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.shiftWorkingForm = this.fb.group({
            id: 0,
            code: null,
            shiftCode: [null, Validators.required],
            workingDay: [null, Validators.required],
            workingDayName: null,
            workingTime: null,
            workingHour: null,
            minWorkingHour: null,
        });
        this.shiftWorkingForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.shiftWorkingForm.invalid || this.shiftWorkingForm.dirty]);
    }

    private patchForm(s: any) {
        this.shiftWorkingForm.patchValue({
            id: s.id,
            code: s.code,
            shiftCode: s.shiftCode,
            workingDay: s.workingDay,
            workingDayName: s.workingDayName,
            workingTime: s.workingTime,
            workingHour: s.workingHour,
            minWorkingHour: s.minWorkingHour,
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.shiftWorkingForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.shiftWorkingService.addOrUpdate(this.shiftWorkingForm.value)
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

    ngAfterViewInit() {
        this.genericValidator.initValidationProcess(this.shiftWorkingForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.shiftWorkingService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const s: any = res;
                    this.patchForm(s);
                });
        }
    }

    cancel() {
        if (this.shiftWorkingForm.dirty) {
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
