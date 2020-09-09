import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { ChangesConfirmComponent } from '../../../../shared';
import { FamilyDetailsService } from './family-details.service';


@Component({
    templateUrl: './family-details-form.component.html',
    styleUrls: ['./family-details.component.scss']
})
export class FamilyDetailsFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    familyDetailsForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private familyService: FamilyDetailsService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<FamilyDetailsFormComponent>,
                @Inject(MAT_DIALOG_DATA)
                 public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name Must Be Required',
            },
            phoneNumber: {
                pattern: 'Enter Valid Number',
                minLength: 'Minimum 9 digit Required'
            },
            mobileNumber: {
                pattern: 'Enter Valid Number',
                minLength: 'Minimum 10 digit Required'
            }
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Approve' },
        { key: 4, value: 'Pending' }
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.familyDetailsForm = this.fb.group({
            id: 0,
            empCode: null,
            name: [null, Validators.required],
            nameNepali: null,
            relation: null,
            occupation: null,
            phoneNumber: [null, [Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$'), Validators.minLength(9)]],
            mobileNumber: [null, [Validators.pattern('^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$'), Validators.minLength(10)]],
            dateOfBirth: null,
            dateOfBirthNepali: null,
            description: null,
            status: 'Active'
        });
        this.familyDetailsForm.valueChanges
            .subscribe(_ => this.dialogRef.disableClose = this.familyDetailsForm.invalid || this.familyDetailsForm.dirty);
    }
    private patchForm(f: any) {
        this.familyDetailsForm.patchValue({
            id: f.id,
            empCode: f.empCode,
            name: f.name,
            nameNepali: f.nameNepali,
            relation: f.relation,
            occupation: f.occupation,
            phoneNumber: f.phoneNumber,
            mobileNumber: f.mobileNumber,
            dateOfBirth: f.dateOfBirth,
            dateOfBirthNepali: f.dateOfBirthNepali,
            description: f.description,
            status: f.status,
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.familyDetailsForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.familyService.addOrUpdate(this.familyDetailsForm.value)
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
        this.genericValidator.initValidationProcess(this.familyDetailsForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.familyService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const f: any = res;
                    this.patchForm(f);
                });
        }
    }

    cancel() {
        if (this.familyDetailsForm.dirty) {
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
