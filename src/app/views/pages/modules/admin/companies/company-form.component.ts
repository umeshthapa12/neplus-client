import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSelectChange } from '@angular/material/select';
import { Select } from '@ngxs/store';
import Quill from 'quill';
import { Observable, Subject } from 'rxjs';
import { debounceTime, delay, filter, takeUntil } from 'rxjs/operators';
import { Companies, ErrorCollection, PhoneNumberModel, ResponseModel } from '../../../../../models';
import { DropdownModel, DropdownProviderService } from '../../../../../services';
import { fadeIn, GenericValidator, QuilljsService, validateBeforeSubmit } from '../../../../../utils';
import { ChangesConfirmComponent } from '../../../../shared';
import { CompanyService } from './company.service';
import { DropdownStateSelector } from '../../../../../store/selectors';

@Component({
    templateUrl: './company-form.component.html',
    animations: [fadeIn]
})
export class CompanyFormComponent implements OnInit, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    companyForm: FormGroup;
    displayMessage: any = {};

    hideNew = true;
    hideConfirm = true;

    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    isError: boolean;
    responseMessage: string;
    errors: ErrorCollection[];
    isWorking: boolean;
    isOtherCategory: boolean;
    quill$: Quill;

    phoneType = ['Mobile', 'Office', 'Support'];

    // name of the slice -> state.action
    @Select(DropdownStateSelector.SliceOf('jobCategories')) categories$: Observable<DropdownModel[]>;
    @Select(DropdownStateSelector.SliceOf('CompanyTypes')) companyType$: Observable<DropdownModel[]>;

    @ViewChild('aboutCompany', { read: ElementRef, static: true })
    private aboutCompanyEl: ElementRef;

    constructor(
        private cdr: ChangeDetectorRef,
        private cService: CompanyService,
        private fb: FormBuilder,
        private quilljsService: QuilljsService,
        private dialogRef: MatDialogRef<CompanyFormComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            username: {
                required: 'This field is required.'
            },
            password: {
                required: 'This field is required.'
            },
            cPassword: {
                required: 'This field is required.',
                compare: 'Confirm password does not match'
            },
            name: {
                required: 'This field is required.'
            },
            companyTypeId: {
                required: 'This field is required.'
            },
            categoryId: {
                required: 'This field is required.'
            },
            employeeSize: {
                required: 'This field is required.'
            },
            address: {
                required: 'This field is required.'
            },
            about: {
                required: 'This field is required.'
            },
            otherCategory: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    ngAfterViewInit() {

        this.genericValidator
            .initValidationProcess(this.companyForm, this.formInputElements)
            .subscribe(m => this.displayMessage = m);

        this.quill$ = this.quilljsService
            .initQuill(this.aboutCompanyEl)
            .textChangeValueSetter(this.companyForm.get('about'), 'json')
            .getQuillInstance();


        if (this.data.id > 0) {
            this.cService.getCompanyById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(800)
            ).subscribe(res => {
                const d: Companies = res.contentBody;
                this.patchForm(d);
                if (d.about) {
                    const a = JSON.parse(d.about);
                    this.quill$.setContents(a);
                }
            });
        }
    }

    onImageCropped = (image: Blob) => this.companyForm.get('profilePicture').setValue(image);

    categoryValueChange(v: MatSelectChange) {

        this.cdr.markForCheck();

        const op = v.source.selected as MatOption;
        const value = op.viewValue.toLowerCase().trim();
        const ctrl = this.companyForm.get('otherCategory');

        // there may be other type of category so user can add one in the text box
        if (value === 'other' || value === 'others') {
            ctrl.reset(null);
            ctrl.setValidators(Validators.required);
            this.isOtherCategory = true;
        } else {
            ctrl.clearValidators();
            this.isOtherCategory = false;
        }

        ctrl.updateValueAndValidity();
    }

    contactControls(): FormArray {
        return  this.companyForm.get('phoneNumbers') as FormArray;
    }

    contactNumberAction(index: number) {
        const controls = this.contactControls();
        if (index > -1) {
            controls.removeAt(index);
        } else {
            controls.push(this.createItem());
            setTimeout(() => {
                document.getElementById('contact-phone-wrap').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
            }, 100);
        }
    }

    saveChanges() {
        this.cdr.markForCheck();
        this.clearErrors();

        // invalid form without filling required fields
        const errorMessage = validateBeforeSubmit(this.companyForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;

        this.cService.addOrUpdateCompany(this.companyForm.value)
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

    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    onCancel() {
        if (this.companyForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    private createItem(model?: PhoneNumberModel): FormGroup {
        return this.fb.group({
            phoneType: (model && model.phoneType || 'Office'),
            number: [(model && model.number), [Validators.required, Validators.maxLength(15)]],
        });
    }

    private initForm() {

        this.companyForm = this.fb.group({

            id: 0,
            regGuid: null,
            // account info
            username: [null, Validators.required],
            password: [null, Validators.required],
            cPassword: [null, Validators.required],

            // profile info
            name: [null, Validators.required],
            companyTypeId: [null, Validators.required],
            categoryId: [null, Validators.required],
            otherCategory: null,
            email: null,
            employeeSize: [null, Validators.required],
            address: [null, Validators.required],
            url: null,
            about: [null, Validators.required],
            phoneNumbers: this.fb.array([this.createItem()]),

            // contact person info
            contactPersonName: [null, Validators.required],
            contactPersonDesignation: null,
            contactPersonPhone: [null, Validators.required],
            contactPersonAddress: [null, Validators.required],
            contactPersonDescription: null,
            contactPersonEmail: null,

            // Extra for profile picture
            profilePicture: null

        });

        this.companyForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.companyForm.dirty || this.companyForm.invalid]);
    }

    private patchForm(d: Companies) {

        this.cdr.markForCheck();

        const controls = this.contactControls();

        if (d.phoneNumbers && d.phoneNumbers.length > 0) {
            // clear all controls if we have some response data
            controls.controls = [];
            d.phoneNumbers.forEach(p => controls.push(this.createItem(p)));
        }

        // since we don't needed to validate user account info on update section
        if (d.id > 0) {
            this.companyForm.get('username').setErrors(null);
            this.companyForm.get('password').setErrors(null);
            this.companyForm.get('cPassword').setErrors(null);
        }

        this.companyForm.patchValue({

            id: d.id,
            regGuid: d.regGuid,
            // profile info
            name: d.name,
            companyTypeId: d.companyTypeId,
            categoryId: d.categoryId,
            otherCategory: d.otherCategory,
            email: d.email,
            employeeSize: d.employeeSize,
            address: d.address,
            url: d.url,
            about: d.about,
            phoneNumbers: d.phoneNumbers,

            // contact person info
            contactPersonName: d.contactPersonName,
            contactPersonDesignation: d.contactPersonDesignation,
            contactPersonPhone: d.contactPersonPhone,
            contactPersonAddress: d.contactPersonAddress,
            contactPersonDescription: d.contactPersonDescription,
            contactPersonEmail: d.contactPersonEmail

        });

        // we grab datasets rom state history so we update view
        this.categories$.pipe(debounceTime(900), filter(_ => !this.isOtherCategory)).subscribe(categories => {

            const id = +this.companyForm.get('categoryId').value;
            const el = categories.find(_ => _.key === id);
            if (el && (el.value.toLowerCase().trim() === 'other' || el.value.toLowerCase().trim() === 'others')) {
                this.isOtherCategory = true;
            }
        });
    }
}
