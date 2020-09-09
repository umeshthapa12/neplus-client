import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChildren, ElementRef, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { filter, takeUntil, delay } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControlName, Validators } from '@angular/forms';
import { ErrorCollection, ResponseModel } from '../../../../../../models';
import { fadeIn, GenericValidator, validateBeforeSubmit } from '../../../../../../utils';
import { ChangesConfirmComponent } from '../../../../../shared';
import { BasicInfoService } from './basic-info-service';

@Component({
    templateUrl: './basic-info-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class BasicInfoFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    employeeForm: FormGroup;

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<BasicInfoFormComponent>,
        private basicInfoService: BasicInfoService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            empCode: {
                required: 'This field is required.'
            },
            firstName: {
                required: 'This field is required.'
            },
            lastName: {
                required: 'This field is required.'
            },
            mobileNumber: {
                required: 'This field is required.'
            },
            email: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
        console.log(this.data);
    }

    private initForm() {
        this.employeeForm = this.fb.group({
            id: 0,
            empCode: [null, Validators.required],
            title: null,
            firstName: [null, Validators.required],
            middleName: null,
            lastName: [null, Validators.required],
            dateOfBirth: null,
            maritalStatus: null,
            gender: null,
            religion: null,
            bloodGroup: null,
            nationality: null,
            telNo: null,
            mobileNumber: [null, Validators.required],
            email: [null, Validators.required],
            alternativeEmail: null,
            refrencePerson: null,
            settlementStatus: null,
            settlementDate: null,
            remarks: null,
            status: ['Active']
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.employeeForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.employeeForm.dirty || this.employeeForm.invalid]);
    }

    private patchForm(d: any) {
        this.employeeForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            title: d.title,
            firstName: d.firstName,
            middleName: d.middleName,
            lastName: d.lastName,
            dateOfBirth: d.dateOfBirth,
            maritalStatus: d.maritalStatus,
            gender: d.gender,
            religion: d.religion,
            bloodGroup: d.bloodGroup,
            nationality: d.nationality,
            telNo: d.telNo,
            mobileNumber: d.mobileNumber,
            email: d.email,
            alternativeEmail: d.alternativeEmail,
            refrencePerson: d.refrencePerson,
            settlementDate: d.settlementDate,
            settlementStatus: d.settlementStatus,
            remarks: d.remarks,
            status: d.status
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.employeeForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        if (this.data.id > -1) {
            this.basicInfoService.update(this.employeeForm.value)
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
        } else {

            this.basicInfoService.add(this.employeeForm.value)
                // this.dService.addOrUpdate(this.dForm.value)
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
    }

    cancel() {
        if (this.employeeForm.dirty) {
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
            .initValidationProcess(this.employeeForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.employeeService.getEmployeeById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }

        if (this.data.id > 0) {
            this.basicInfoService.getListById(this.data.id).pipe(
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
