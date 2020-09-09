import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { AttendanceDevicesService } from './attendance-devices.service';

@Component({
    templateUrl: './attendance-devices-form.component.html',
    styleUrls: ['../attendance.component.scss']
})
export class AttendanceDevicesFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    attendanceDevicesForm: FormGroup;
    isWorking: boolean;
    displayMessage: any = {};
    isError: boolean;
    errors: any[];
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    genericValidator: GenericValidator;

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AttendanceDevicesFormComponent>,
        private attendanceDeviceService: AttendanceDevicesService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            lastLogDownloadDate: {
                required: 'This is the Required field',
            },
            deviceType: {
                required: 'This is the Required field',
            },
            deviceLocationBranch: {
                required: 'This is the required field'
            }
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' }
    ];

    deviceType = [
        { key: 1, value: 'Manual recording' },
        { key: 2, value: 'Timesheets' },
        { key: 3, value: 'Biometrics' }
    ];

    locationBranches = [
        { key: 1, value: 'Kathmandu' },
        { key: 2, value: 'Lalitpur' },
        { key: 3, value: 'Chitwan' },
    ];

    attendanceGroupDevices = [
        { key: 1, value: 'Development' },
        { key: 2, value: 'Production' },
    ];

    ngOnInit() {
        this.initForm();
    }
    private initForm() {
        this.attendanceDevicesForm = this.fb.group({
            id: 0,
            lastLogDownloadDate: [null, Validators.required],
            transactionStamp: null,
            lastPing: null,
            deviceType: [null, Validators.required],
            opStamp: null,
            downLoadType: null,
            timeZone: null,
            deviceLocationBranch: [null, Validators.required],
            deviceLocationDepartment: null,
            timeOut: null,
            attendanceDeviceGroup: null,
            license: null,
            status: 'Active',
        });
        this.attendanceDevicesForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.attendanceDevicesForm.invalid || this.attendanceDevicesForm.dirty]);
    }

    private patchForm(a: any) {
        this.attendanceDevicesForm.patchValue({
            id: a.id,
            lastLogDownloadDate: a.lastLogDownloadDate,
            transactionStamp: a.transactionStamp,
            lastPing: a.lastPing,
            deviceType: a.deviceType,
            opStamp: a.opStamp,
            downLoadType: a.downLoadType,
            timeZone: a.timeZone,
            deviceLocationBranch: a.deviceLocationBranch,
            deviceLocationDepartment: a.deviceLocationDepartment,
            timeOut: a.timeOut,
            attendanceDeviceGroup: a.attendanceDeviceGroup,
            license: a.license,
            status: a.status
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.attendanceDevicesForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.attendanceDeviceService.addOrUpdate(this.attendanceDevicesForm.value)
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
        this.genericValidator.initValidationProcess(this.attendanceDevicesForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.attendanceDeviceService.getLIstById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const d: any = res;
                    this.patchForm(d);
                });
        }
    }

    cancel() {
        if (this.attendanceDevicesForm.dirty) {
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
