import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { AttendanceManualService } from './attendance-manual.service';

@Component({
    templateUrl: './attendance-manual-form.component.html',
    styleUrls: ['../attendance.component.scss']
})
export class AttendanceManualFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    attendanceManualForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    displayMessage: any = {};
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private attendanceManualService: AttendanceManualService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AttendanceManualFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            deviceLog: {
                required: 'This is the required field'
            },
            logDate: {
                required: 'This is the required field',
            },
            attendanceCode: {
                required: 'This is the required field'
            }

        });
    }

    deviceLog = [
        { key: 1, value: 'Facial Recognition' },
        { key: 2, value: 'Fingerprint Reader' },
        { key: 3, value: 'By Password' }
    ];

    attendanceCode = [
        { key: 1, value: 'A-453' },
        { key: 2, value: 'E-456' },
    ];

    deviceIds = [
        { key: 1, value: 'Att-453' },
        { key: 2, value: 'Ad-123' },
        { key: 3, value: 'Ad-675' },
    ];
    requests = [
        { key: 1, value: 'Manual' },
        { key: 2, value: 'By username' },
    ];

    ngOnInit() {
        this.initForm();
    }
    private initForm() {
        this.attendanceManualForm = this.fb.group({
            id: 0,
            deviceLog: [null, Validators.required],
            logDate: [null, Validators.required],
            logDateNepali: null,
            logTime: null,
            attendanceCode: [null, Validators.required],
            deviceId: null,
            direction: null,
            request: null,
            empCode: null,
            logSource: null,
        });
    }

    private patchForm(a: any) {
        this.attendanceManualForm.patchValue({
            id: a.id,
            deviceLog: a.deviceLog,
            logDate: a.logDate,
            logDateNepali: a.logDateNepali,
            logTime: a.logTime,
            attendanceCode: a.attendanceCode,
            deviceId: a.deviceId,
            direction: a.direction,
            request: a.request,
            empCode: a.empCode,
            logSource: a.logSource,
        });
        this.attendanceManualForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.attendanceManualForm.invalid || this.attendanceManualForm.dirty]);
    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.attendanceManualForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.attendanceManualService.addOrUpdate(this.attendanceManualForm.value)
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
        this.genericValidator.initValidationProcess(this.attendanceManualForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.attendanceManualService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const a: any = res;
                    this.patchForm(a);
                });
        }
    }
    cancel() {
        if (this.attendanceManualForm.dirty) {
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
