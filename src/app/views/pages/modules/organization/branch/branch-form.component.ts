import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { GenericValidator, fadeIn, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { BranchService } from './branch.service';

@Component({
    templateUrl: './branch-form.component.html',
    animations: [fadeIn],
    styleUrls: ['./branch.component.scss'],

})
export class BranchFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    branchForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    responseMessage: string;
    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<BranchFormComponent>,
                private branchService: BranchService,
                private cdr: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA)
                public data: any
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must be Required'
            },
            address: {
                required: 'Address is Required'
            },
            phone: {
                required: 'Phone no is Required',
                pattern: 'Only number are allowed.',
                minLength: 'Phone shoule be atleast 9 digit',
            },
            email: {
                required: 'Email must be Required',
                pattern: 'Please enter Valid Email'
            },
            district: {
                required: 'District must be  Required'
            },
            state: {
                required: 'State must be Required'
            },
            country: {
                required: 'Country Must be required'
            },
            // mailingAddress: {
            //     required: 'Mailing Address must be required'
            // },
        });
    }

    districts: any[] = [
        { key: 1, value: 'Kathmandu' },
        { key: 2, value: 'Lalitpur' },
        { key: 3, value: 'Bhaktapur' },
        { key: 4, value: 'Chitwan' },
    ];

    states: any[] = [
        { key: 1, value: 'Seti' },
        { key: 2, value: 'Janaki' },
        { key: 3, value: 'Bagmati' },
        { key: 4, value: 'Gandaki' },
        { key: 5, value: 'Lumbini' },
        { key: 6, value: 'Karnali' },
        { key: 7, value: 'Suderpschhim' }
    ];

    countries: any[] = [
        { kay: 1, value: 'Nepal' },
        { key: 2, value: 'India' },
        { key: 3, value: 'China' },
        { key: 4, value: 'America' }
    ];

    status: any[] = [
        // {key: 1, value: 'Active'},
        // {key: 2, value: 'Inactive'},
        // {key: 3, value: 'Pending'},
        // {key: 4, value: 'Approved'}
    ];


    ngOnInit() {
        this.initForm();
        // console.log(this.data);
    }

    private initForm() {
        this.branchForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            address: [null, Validators.required],
            phone: [null, [Validators.required, Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$'), Validators.minLength(9)]],
            email: [null, [Validators.required, Validators.email, Validators.pattern('^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+.[a-zA-Z0-9-.]+$')]],
            district: [null, Validators.required],
            state: [null, Validators.required],
            country: [null, Validators.required],
            mailingAddress: null,
            branchTimeZone: null,
            geoLocation: null,
            status: 'Active',
        });
        this.branchForm.valueChanges.pipe(
            takeUntil(this.toDestroy$))
            .subscribe(_ => [this.dialogRef.disableClose = this.branchForm.dirty || this.branchForm.invalid]);
    }


    private pathForm(b: any) {
        this.cdr.markForCheck();
        this.branchForm.patchValue({
            id: b.id,
            name: b.name,
            nname: b.nname,
            address: b.address,
            phone: b.phone,
            email: b.email,
            district: b.district,
            state: b.state,
            country: b.country,
            mailingAddress: b.mailingAddress,
            branchTimeZone: b.branchTimeZone,
            geoLocation: b.geoLocation,
            status: b.status,
        });
    }



    saveChanges() {

        this.clearErrors();
        const errorMessage = validateBeforeSubmit(this.branchForm, document.querySelector(`#res-message`));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.branchService.addOrUpdates(this.branchForm.value)
            // this.branchService.addOrUpdate(this.branchForm.value)
            .pipe(takeUntil(this.toDestroy$),
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

                if (errors && errors.length > 0) {
                    this.errors = errors;
                    this.responseMessage = model.messageBody;
                }
            });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.branchForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.branchService.getBranchById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }
        if (this.data.id > 0) {
            this.branchService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(500))
                .subscribe(r => {
                    const d: any = r;
                    this.pathForm(d);
                });
        }
    }

    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;

    }

    cancel() {

        if (this.branchForm.dirty) {
            this.dialog.open(ChangesConfirmComponent)
                .afterClosed().pipe(filter(_ => _))
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
