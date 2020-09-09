import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, Inject, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { ChangesConfirmComponent } from './../../../../shared';
import { GenericValidator, validateBeforeSubmit, fadeIn } from './../../../../../utils';
import { ServiceInformationService } from './service-information.service';

@Component({
    templateUrl: './service-information-form.component.html',
    styleUrls: ['./service-information.component.scss'],
    animations: [fadeIn]
})
export class ServiceInformationFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    serviceInfoForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    responseMessage: string;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    constructor(
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private serviceInfoService: ServiceInformationService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<ServiceInformationFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            location: {
                required: 'This is required field',
            },
            branch: {
                required: 'This is required field',
            },
            department: {
                required: 'This is the required field',
            }
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Approve' },
        { key: 4, value: 'Pending' },
    ];

    empGroups = [
        {key: 1, value: 'Development'}
    ];


    branchs = [
        {key: 1, value : 'Kathmandu'}
    ];
    locations = [
        {key: 1, value: 'Kathmandu - Nepali'}
    ];
    departments = [
        {key: 1, value: 'Building'}
    ];
    designations = [
        {key: 1, value: 'Manager'}
    ];
    units = [
        {key: 1, value: 'Second'}
    ];
    serviceGroups = [
        {key: 1, value: 'Delivery'}
    ];
    services = [
        {key: 1, value: 'Load/Unload'}
    ];
    serviceSubGroups = [
        {key: 1, value: 'Local'}
    ];
    contractType = [
        {key: 1, value: 'Full-time'}
    ];
    employeeLevel = [
        {key: 1, value: 'Top-Level'}
    ];
    remunerations = [
        {key: 1, value: 'Monthly-Payment'}
    ];
    appointments = [
        {key: 1, value: 'Diract'}
    ];
    workingStatus = [
        {key: 1, value: 'Active'}
    ];
    supervisors = [
        {key: 1, value: 'AAAAABBB'}
    ];


    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.serviceInfoForm = this.fb.group({
            id: 0,
            empCode: null,
            empGroup: null,
            location: [null, Validators.required],
            branch: [null, Validators.required],
            department: [null, Validators.required],
            designation: null,
            unit: null,
            serviceGroup: null,
            service: null,
            serviceSubGroup: null,
            darbandi: null,
            deputation: null,
            contractType: null,
            employeeLevel: null,
            empJobPost: null,
            remunerationGroup: null,
            appointmentType: null,
            dateOfJoin: null,
            dateOfJoinNepali: null,
            contractStartDate: null,
            contractStartDateNepali: null,
            dateOfPermanent: null,
            dateOfPermanentNepali: null,
            dateOfTransfer: null,
            dateOfTransferNepali: null,
            dateOfPromotion: null,
            dateOfPromotionNepali: null,
            probationDate: null,
            probationDateNepali: null,
            dateOfLastServiceRenew: null,
            dateOfLastServiceRenewNepali: null,
            serviceDurationEndDate: null,
            serviceDurationEndDateNepali: null,
            dueDateOfRetirement: null,
            dueDateOfRetirementNepali: null,
            compulsoryRetirementDate: null,
            compulsoryRetirementDateNepali: null,
            dateOfStopPayment: null,
            dateOfStopPaymentNepali: null,
            contractPeriod: null,
            workingStatus: null,
            supervisorCode: null,
            status: 'Active',
        });
        this.serviceInfoForm.valueChanges
            .pipe(takeUntil(this.toDestroy$))
            .subscribe(_ => [this.dialogRef.disableClose = this.serviceInfoForm.invalid || this.serviceInfoForm.dirty]);
    }

    private patchForm(s: any) {
        this.serviceInfoForm.patchValue({
            id: s.id,
            empCode: s.empCode,
            empGroup: s.empGroup,
            location: s.location,
            branch: s.branch,
            department: s.department,
            designation: s.designation,
            unit: s.unit,
            serviceGroup: s.serviceGroup,
            service: s.service,
            serviceSubGroup: s.serviceSubGroup,
            darbandi: s.darbandi,
            deputation: s.deputation,
            contractType: s.contractType,
            employeeLevel: s.employeeLevel,
            empJobPost: s.empJobPost,
            remunerationGroup: s.remunerationGroup,
            appointmentType: s.appointmentType,
            dateOfJoin: s.dateOfJoin,
            dateOfJoinNepali: s.dateOfJoinNepali,
            contractStartDate: s.contractStartDate,
            contractStartDateNepali: s.contractStartDateNepali,
            dateOfPermanent: s.dateOfPermanent,
            dateOfPermanentNepali: s.dateOfPermanentNepali,
            dateOfTransfer: s.dateOfTransfer,
            dateOfTransferNepali: s.dateOfTransferNepali,
            dateOfPromotion: s.dateOfPromotion,
            dateOfPromotionNepali: s.dateOfPromotionNepali,
            probationDate: s.probationDate,
            probationDateNepali: s.probationDateNepali,
            dateOfLastServiceRenew: s.dateOfLastServiceRenew,
            dateOfLastServiceRenewNepali: s.dateOfLastServiceRenewNepali,
            serviceDurationEndDate: s.serviceDurationEndDate,
            serviceDurationEndDateNepali: s.serviceDurationEndDateNepali,
            dueDateOfRetirement: s.dueDateOfRetirement,
            dueDateOfRetirementNepali: s.dueDateOfRetirementNepali,
            compulsoryRetirementDate: s.compulsoryRetirementDate,
            compulsoryRetirementDateNepali: s.compulsoryRetirementDateNepali,
            dateOfStopPayment: s.dateOfStopPayment,
            dateOfStopPaymentNepali: s.dateOfStopPaymentNepali,
            contractPeriod: s.contractPeriod,
            workingStatus: s.workingStatus,
            supervisorCode: s.supervisorCode,
            status: s.status,
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.serviceInfoForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.serviceInfoService.addOrUpdate(this.serviceInfoForm.value)
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
        this.genericValidator.initValidationProcess(this.serviceInfoForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.serviceInfoService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const i: any = res;
                    this.patchForm(i);
                });
        }
    }
    cancel() {
        if (this.serviceInfoForm.dirty) {
            this.dialog.open(ChangesConfirmComponent)
                .afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }
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
