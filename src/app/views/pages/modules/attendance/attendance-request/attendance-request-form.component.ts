import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { AttendanceRequestService } from './attendance-request.service';

@Component({
    templateUrl: './attendance-request-form.component.html',
    styleUrls: ['../attendance.component.scss']
})
export class AttendanceRequestFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    attendanceRequestForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    genericValidator: GenericValidator;

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AttendanceRequestFormComponent>,
        private attendanceRequestService: AttendanceRequestService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            attendanceCode: {
                required: 'This is the required field'
            }
        });
    }

    attendancesCodes = [
        { key: 1, value: 'At-4342' },
        { key: 2, value: 'At-E234' },
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.attendanceRequestForm = this.fb.group({
            id: 0,
            empCode: null,
            attendanceDate: null,
            attendanceDateNepali: null,
            logTime: null,
            attendanceCode: [null, Validators.required],
            direction: null,
            remarks: null,
            approvalStatus: null,
            entryDate: null,
            entryBy: null,
            actionBy: null,
            actionDate: null,
            localIp: null,
            publicIp: null,
            actionRemarks: null,
            outPlace: null,
            plannedReturnTime: null,
            requestSource: null,
            location: null,
            mapLocation: null,
            mapLocationName: null,
            imeiNumber: null,
        });
        this.attendanceRequestForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.attendanceRequestForm.invalid || this.attendanceRequestForm.dirty]);
    }

    private patchForm(r: any) {
        this.attendanceRequestForm.patchValue({
            id: r.id,
            empCode: r.empCode,
            attendanceDate: r.attendanceDate,
            attendanceDateNepali: r.attendanceDateNepali,
            logTime: r.logTime,
            attendanceCode: r.attendanceCode,
            direction: r.direction,
            remarks: r.remarks,
            approvalStatus: r.approvalStatus,
            entryDate: r.entryDate,
            entryBy: r.entryBy,
            actionBy: r.actionBy,
            actionDate: r.actionDate,
            localIp: r.localIp,
            publicIp: r.publicIp,
            actionRemarks: r.actionRemarks,
            outPlace: r.outPlace,
            plannedReturnTime: r.plannedReturnTime,
            requestSource: r.requestSource,
            location: r.location,
            mapLocation: r.mapLocation,
            mapLocationName: r.mapLocationName,
            imeiNumber: r.imeiNumber,
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.attendanceRequestForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.attendanceRequestService.addOrUpdate(this.attendanceRequestForm.value)
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
        this.genericValidator.initValidationProcess(this.attendanceRequestForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.attendanceRequestService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const a: any = res;
                    this.patchForm(a);
                });
        }
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
    cancel() {
        if (this.attendanceRequestForm.dirty) {
            this.dialog.open(ChangesConfirmComponent)
                .afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

}
