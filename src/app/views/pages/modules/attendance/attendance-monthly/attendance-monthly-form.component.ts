import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { AttendanceMonthlyService } from './attendance-monthly.service';

@Component({
    templateUrl: './attendance-monthly-form.component.html',
    styleUrls: ['../attendance.component.scss']
})
export class AttendanceMonthlyFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    attendanceMonthlyForm: FormGroup;
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
        private attendanceMonthlyService: AttendanceMonthlyService,
        private dialogRef: MatDialogRef<AttendanceMonthlyFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({});
    }

    attendanceSheet = [
        { key: 1, value: 'Digital' },
        { key: 2, value: 'Manual' },
    ];

    attendances = [
        { key: 1, value: 'Finger Print' },
        { key: 1, value: 'Face Recognization' },
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.attendanceMonthlyForm = this.fb.group({
            id: 0,
            empCode: null,
            attendanceSheet: null,
            fiscalYear: null,
            salaryMonthNo: null,
            salaryYear: null,
            monthOrder: null,
            totalDaysInMonth: null,
            totalWorkingDays: null,
            leaveDays: null,
            absentDays: null,
            totalHolidays: null,
            totalWorkedDays: null,
            totalSalaryDays: null,
            allowanceDays: null,
            leaveWOPDays: null,
            adjDays: null,
            dateFrom: null,
            dateFromNepali: null,
            dateTo: null,
            dateToNepali: null,
            leaveDifferentFromSalaryPeriod: null,
            leaveDateFrom: null,
            leaveDateFromNepali: null,
            leaveDateTo: null,
            leaveDateToNepali: null,
            overTime: null,
            leaveDetails: null,
            fieldWorkDays: null,
            offDayPresent: null,
            attendance: null,
            offDayOT: null,
            dailyHour: null,
            monthlyAttendanceMaster: null,
        });
        this.attendanceMonthlyForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.attendanceMonthlyForm.invalid || this.attendanceMonthlyForm.dirty]);
    }

    private patchForm(m: any) {
        this.attendanceMonthlyForm.patchValue({
            id: m.id,
            empCode: m.empCode,
            attendanceSheet: m.attendanceSheet,
            fiscalYear: m.fiscalYear,
            salaryMonthNo: m.salaryMonthNo,
            salaryYear: m.salaryYear,
            monthOrder: m.monthOrder,
            totalDaysInMonth: m.totalDaysInMonth,
            totalWorkingDays: m.totalWorkingDays,
            leaveDays: m.leaveDays,
            absentDays: m.absentDays,
            totalHolidays: m.totalHolidays,
            totalWorkedDays: m.totalWorkedDays,
            totalSalaryDays: m.totalSalaryDays,
            allowanceDays: m.allowanceDays,
            leaveWOPDays: m.leaveWOPDays,
            adjDays: m.adjDays,
            dateFrom: m.dateFrom,
            dateFromNepali: m.dateFromNepali,
            dateTo: m.dateTo,
            dateToNepali: m.dateToNepali,
            leaveDifferentFromSalaryPeriod: m.leaveDifferentFromSalaryPeriod,
            leaveDateFrom: m.leaveDateFrom,
            leaveDateFromNepali: m.leaveDateFromNepali,
            leaveDateTo: m.leaveDateTo,
            leaveDateToNepali: m.leaveDateToNepali,
            overTime: m.overTime,
            leaveDetails: m.leaveDetails,
            fieldWorkDays: m.fieldWorkDays,
            offDayPresent: m.offDayPresent,
            attendance: m.attendance,
            offDayOT: m.offDayOT,
            dailyHour: m.dailyHour,
            monthlyAttendanceMaster: m.monthlyAttendanceMaster,
        });
    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.attendanceMonthlyForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.attendanceMonthlyService.addOrUpdate(this.attendanceMonthlyForm.value)
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
        this.genericValidator.initValidationProcess(this.attendanceMonthlyForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id) {
            this.attendanceMonthlyService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const a: any = res;
                    this.patchForm(a);
                });
        }
    }

    cancel() {
        if (this.attendanceMonthlyForm.dirty) {
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
