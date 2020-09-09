import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { GenericValidator, fadeIn, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { CompanyInformationService } from './company-information.service';


@Component({
    templateUrl: './company-information-form.component.html',
    styleUrls: ['./company-information.component.scss'],
    animations: [fadeIn]

})
export class CompanyInformationFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    companyInformationForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    responseMessage: string;
    displayMessage: any = {};
    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(private fb: FormBuilder,
                private companyService: CompanyInformationService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<CompanyInformationFormComponent>,
                private cdr: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA)
                public data: any
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must be Required'
            },
            registrationNumber: {
                required: 'This is the required field'
            },
            panNumber: {
                required: 'This is the required field'
            },
            registrationDate: {
                required: 'This is the required field'
            },
            address: {
                required: 'This is the required field'
            },
            mailingAddress: {
                required: 'This is then required field'
            },
            phone: {
                required: 'This is the required field',
                pattern: 'Only number are allowed',
                minLength: 'Phone shoule be atleast 9 digit'
            },
            mobile: {
                required: 'This is the required field',
                pattern: 'Only number are allowed',
                minLength: 'Mobile Should be atleast 10 digit'
            },
            email: {
                required: 'This is the required field',
                email: 'Please Enter Valid Email '
            },
            logo: {
                required: 'This is then rquired field'
            }
        });
    }

    ngOnInit() {
        this.initForm();
        // console.log(this.data);
    }

    initForm() {
        this.companyInformationForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            registrationNumber: [null, Validators.required],
            panNumber: [null, Validators.required],
            registrationDate: [null, Validators.required],
            address: [null, Validators.required],
            mailingAddress: [null, Validators.required],
            phone: [null, [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$'), Validators.minLength(9)]],
            mobile: [null, [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$'), Validators.minLength(10)]],
            email: [null, [Validators.required, Validators.email]],
            logo: [null, Validators.required]
        });
        this.companyInformationForm.valueChanges.pipe(
            takeUntil(this.toDestroy$)
        ).subscribe(_ => [this.dialogRef.disableClose = this.companyInformationForm.dirty || this.companyInformationForm.invalid]);
    }

    private patchForm(c: any) {
        this.companyInformationForm.patchValue({
            id: c.id,
            name: c.name,
            nameNepali: c.nameNepali,
            registrationNumber: c.registrationNumber,
            panNumber: c.panNumber,
            registrationDate: c.registrationDate,
            address: c.address,
            mailingAddress: c.mailingAddress,
            phone: c.phone,
            mobile: c.mobile,
            email: c.email,
            logo: c.logo,
        });
    }
    saveChanges() {
        this.clearErrors();
        const errorMessage = validateBeforeSubmit(this.companyInformationForm, document.querySelector(`#res-message`));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;
        // console.log(this.companyInformationForm.value);
        this.companyService.addOrUpdate(this.companyInformationForm.value)
            .pipe(takeUntil(this.toDestroy$),
                delay(1500))
            .subscribe(res => {
                this.dialogRef.close(res);
                this.isWorking = false;
            }, e => {
                this.isWorking = false;
                this.isError = true;
                const model: ResponseModel = e.error;
                const errors: ErrorCollection[] = model.contentBody.errors;

                if (errors && errors.length > 0) {
                    this.errors = errors;
                    this.responseMessage = model.messageBody;
                }
            });
    }


    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.companyInformationForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.companyService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$),
                    delay(500))
                .subscribe(r => {
                    const d: any = r;
                    this.patchForm(d);
                });
        }
    }
    cancel() {
        if (this.companyInformationForm.dirty) {
            this.dialog.open(ChangesConfirmComponent)
                .afterClosed().pipe(takeUntil(this.toDestroy$), filter(_ => _))
                .subscribe(_ => [this.dialogRef.close()]);
        } else {
            this.dialogRef.close();
        }
    }
    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
