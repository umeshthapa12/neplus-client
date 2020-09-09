import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { AttendanceShiftService } from './attendance-shift.service';


@Component({
    templateUrl: './attendance-shift-form.component.html',
    styleUrls: ['../attendance.component.scss']
})
export class AttendanceShiftFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    attendanceShiftForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    displayMessage: any = {};
    errors: any[];
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    genericValidator: GenericValidator;

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AttendanceShiftFormComponent>,
        private attendanceShiftService: AttendanceShiftService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This is required Field'
            },
        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.attendanceShiftForm = this.fb.group({
            id: 0,
            code: null,
            name: [null, Validators.required],
            beginTime: null,
            endTime: null,
            break1BeginTime: null,
            break1EndTime: null,
            break2BeginTime: null,
            break2EndTime: null,
            break1Duration: null,
            break2Duration: null,
            shiftDuration: null,
            isNight: null,
            punchBeginDuration: null,
            punchEndDuration: null,
            isLead: null,
            shiftOutStartTime: null,
            shiftOutEndTime: null,
            isCheckNextDayOut: null,
            lateGraceTime: null,
            earlyGraceTime: null,
        });
        this.attendanceShiftForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.attendanceShiftForm.invalid || this.attendanceShiftForm.dirty]);
    }

    private patchForm(a: any) {
        this.attendanceShiftForm.patchValue({
            id: a.id,
            code: a.code,
            name: a.name,
            beginTime: a.beginTime,
            endTime: a.endTime,
            break1BeginTime: a.break1BeginTime,
            break1EndTime: a.break1EndTime,
            break2BeginTime: a.break2BeginTime,
            break2EndTime: a.break2EndTime,
            break1Duration: a.break1Duration,
            break2Duration: a.break2Duration,
            shiftDuration: a.shiftDuration,
            isNight: a.isNight,
            punchBeginDuration: a.punchBeginDuration,
            punchEndDuration: a.punchEndDuration,
            isLead: a.isLead,
            shiftOutStartTime: a.shiftOutStartTime,
            shiftOutEndTime: a.shiftOutEndTime,
            isCheckNextDayOut: a.isCheckNextDayOut,
            lateGraceTime: a.lateGraceTime,
            earlyGraceTime: a.earlyGraceTime,
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.attendanceShiftForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.attendanceShiftService.addOrUpdate(this.attendanceShiftForm.value)
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
        this.genericValidator.initValidationProcess(this.attendanceShiftForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.attendanceShiftService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const d: any = res;
                    this.patchForm(d);
                });
        }
    }
    cancel() {
        if (this.attendanceShiftForm.dirty) {
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
