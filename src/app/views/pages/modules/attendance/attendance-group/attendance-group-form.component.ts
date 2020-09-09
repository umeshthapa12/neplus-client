import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Subject } from 'rxjs';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { ChangesConfirmComponent } from '../../../../shared';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { AttendanceGroupService } from './attendance-group.service';

@Component({
    templateUrl: './attendance-group-form.component.html',
    styleUrls: ['../attendance.component.scss']
})
export class AttendanceGroupFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    attendanceForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private attendanceService: AttendanceGroupService,
        private dialogRef: MatDialogRef<AttendanceGroupFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            code: {
                required: 'This is the Required Field',
            },
            name: {
                required: 'This is the required Field',
            },
            email: {
                email: 'Please Enter Valid Email'
            }
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Approve' },
    ];
    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.attendanceForm = this.fb.group({
            id: 0,
            code: [null, Validators.required],
            name: [null, Validators.required],
            nameNepali: null,
            email: [null, Validators.email],
            description: null,
            status: 'Active'
        });
        this.attendanceForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.attendanceForm.invalid || this.attendanceForm.dirty]);
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.attendanceForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.attendanceService.addOrUpdate(this.attendanceForm.value)
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

    private patchForm(a: any) {
        this.attendanceForm.patchValue({
            id: a.id,
            code: a.code,
            name: a.name,
            nameNepali: a.nameNepali,
            email: a.email,
            description: a.description,
            status: a.status,
        });
    }

    ngAfterViewInit() {
        this.genericValidator.initValidationProcess(this.attendanceForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.attendanceService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const g: any = res;
                    this.patchForm(g);
                });
        }
    }
    cancel() {
        if (this.attendanceForm.dirty) {
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
