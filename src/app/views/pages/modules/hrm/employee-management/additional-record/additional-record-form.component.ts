import { Component, OnInit, ViewChildren, ElementRef, ChangeDetectorRef, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControlName, FormBuilder, Validators } from '@angular/forms';
import { ErrorCollection, ResponseModel } from '../../../../../../../../src/app/models';
import { GenericValidator, validateBeforeSubmit, fadeIn } from '../../../../../../../../src/app/utils';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { AdditionalRecordService } from './additional-record.service';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { Subject } from 'rxjs';

@Component({
    templateUrl: './additional-record-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class AdditionalRecordFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    additionalRecordForm: FormGroup;

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    status: any[] = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
    ];

    identities: any[] = [
        { key: 1, value: 'Citizanship' },
        { key: 2, value: 'Driving License' }
    ];

    identitiesIssuedPlaces: any = [
        { key: 1, value: 'Kathmandu' },
        { key: 2, value: 'Bhaktapur' },
        { key: 3, value: 'Lalitpur' },
    ];
    otherInterests: any[] = [
        {value: 'management'}
    ];

    hobbies: any[] = [
        {value: 'playing'}
    ];
    specialTalents: any[] = [
        {value: 'management'}
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AdditionalRecordFormComponent>,
        private additionalRecordService: AdditionalRecordService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
        });
    }

    ngOnInit() {
        this.initForm();
        console.log(this.data);
    }

    private initForm() {
        this.additionalRecordForm = this.fb.group({
            id: 0,
            empCode: [null, Validators.required],
            empFileNo: null,
            empPanNo: null, empPfNo: null,
            citNo: null,
            insuranceNo: null,
            empPersonalCode: null,
            otherRefNo: null,
            extensionNo: null,
            identityNo: null,
            identityType: null,
            identityIssuedPlace: null,
            drivingLicenseNo: null,
            drivingLicenseExpiryDate: null,
            professionalLicenseNo: null,
            professionalLicenseExpireDate: null,
            joinSalary: null,
            joiningAs: null,
            joiningAsDescription: null,
            joinSalaryDescription: null,
            previousExpYear: null,
            specialTalent: null,
            hobbies: null,
            otherInterest: null,
            status: ['Active']
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.additionalRecordForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.additionalRecordForm.dirty || this.additionalRecordForm.invalid]);
    }

    private patchForm(d: any) {
        this.additionalRecordForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            empFileNo: d.empFileNo,
            empPfNo: d.empPfNo,
            empPanNo: d.empPanNo,
            citNo: d.citNo,
            insuranceNo: d.insuranceNo,
            empPersonalCode: d.empPersonalCode,
            otherRefNo: d.otherRefNo,
            extensionNo: d.extensionNo,
            identityNo: d.identityNo,
            identityType: d.identityType,
            identityIssuedPlace: d.identityIssuedPlace,
            drivingLicenseNo: d.drivingLicenseNo,
            drivingLicenseExpiryDate: d.drivingLicenseExpiryDate,
            professionalLicenseNo: d.professionalLicenseNo,
            professionalLicenseExpireDate: d.professionalLicenseExpireDate,
            joinSalary: d.joinSalary,
            joiningAs: d.joiningAs,
            joiningAsDescription: d.joiningAsDescription,
            joinSalaryDescription: d.joinSalaryDescription,
            previousExpYear: d.previousExpYear, specialTalent: d.specialTalent,
            hobbies: d.hobbies,
            otherInterest: d.otherInterest,
            status: d.status
        });
        this.otherInterests = d.otherInterest;
        this.hobbies = d.hobbies;
        this.specialTalents = d.specialTalent;
    }

    saveChanges() {
        console.log(this.additionalRecordForm.value);
        const errorMessage = validateBeforeSubmit(this.additionalRecordForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.additionalRecordService.addOrUpdate(this.additionalRecordForm.value)
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
        if (this.additionalRecordForm.dirty) {
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
            .initValidationProcess(this.additionalRecordForm, this.formInputElements)
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
            this.additionalRecordService.getListById(this.data.id).pipe(
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
