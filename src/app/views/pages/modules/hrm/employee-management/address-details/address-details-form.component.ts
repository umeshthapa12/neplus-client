import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { AddressDetailsService } from './address-details.service';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { ErrorCollection, ResponseModel } from '../../../../../../../../src/app/models';
import { GenericValidator, validateBeforeSubmit, fadeIn } from '../../../../../../../../src/app/utils';

@Component({
    templateUrl: './address-details-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class AddressDetailsFormComponent implements OnInit, AfterViewInit, OnDestroy {

    private readonly toDestroy$ = new Subject<void>();

    addressDetailsForm: FormGroup;

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
        { key: 4, value: 'Rejected' },
    ];
    cities: any[] = [
        { key: 1, value: 'Kathmandu' },
        { key: 2, value: 'Lalitpur' },
        { key: 3, value: 'Bhaktapur' },
        { key: 4, value: 'Pokhera' },
    ];
    countries: any[] = [
        { key: 1, value: 'Nepal' },
        { key: 2, value: 'USA' },
        { key: 3, value: 'UK' },
        { key: 4, value: 'Australia' },
    ];
    zones: any[] = [
        { key: 1, value: 'Bagmati' },
        { key: 2, value: 'Bheri' },
        { key: 3, value: 'Karnali' },
        { key: 4, value: 'Seti' },
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AddressDetailsFormComponent>,
        private addressDetailsService: AddressDetailsService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            permanentCity: {
                required: 'This field is required.'
            },
            permanentDistrict: {
                required: 'This field is required.'
            },
            permanentCountry: {
                required: 'This field is required.'
            },
            permanentWardNo: {
                required: 'This field is required.'
            },
            currentCity: {
                required: 'This field is required.'
            },
            currentDistrict: {
                required: 'This field is required.'
            },
            currentCountry: {
                required: 'This field is required.'
            },
            currentWardNo: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.addressDetailsForm = this.fb.group({
            id: 0,
            empCode: null,
            permanentHouseNo: null,
            permanentStreet: null,
            permanentWardNo: [null, Validators.required],
            permanentCity: [null, Validators.required],
            permanentDistrict: [null, Validators.required],
            permanentZone: null,
            permanentCountry: [null, Validators.required],
            currentHouseNo: null,
            currentStreet: null,
            currentWardNo: [null, Validators.required],
            currentCity: [null, Validators.required],
            currentZone: null,
            currentDistrict: [null, Validators.required],
            currentCountry: [null, Validators.required],
            status: 'Active'
        });


        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.addressDetailsForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.addressDetailsForm.dirty || this.addressDetailsForm.invalid]);
    }

    private patchForm(d: any) {
        this.addressDetailsForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            permanentHouseNo: d.permanentHouseNo,
            permanentStreet: d.permanentStreet,
            permanentWardNo: d.permanentWardNo,
            permanentCity: d.permanentCity,
            permanentDistrict: d.permanentDistrict,
            permanentZone: d.permanentZone,
            permanentCountry: d.permanentCountry,
            currentHouseNo: d.currentHouseNo,
            currentStreet: d.currentStreet,
            currentWardNo: d.currentWardNo,
            currentCity: d.currentCity,
            currentZone: d.currentZone,
            currentDistrict: d.currentDistrict,
            currentCountry: d.currentCountry,
            status: d.status
        });
    }

    saveChanges() {
        console.log(this.addressDetailsForm.value);
        const errorMessage = validateBeforeSubmit(this.addressDetailsForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.addressDetailsService.addOrUpdate(this.addressDetailsForm.value)
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
        if (this.addressDetailsForm.dirty) {
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
            .initValidationProcess(this.addressDetailsForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.addressDetailsService.getListById(this.data.id).pipe(
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
