import { Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject, Observable } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { Select } from '@ngxs/store';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { GenericValidator, validateBeforeSubmit, fadeIn } from '../../../../../../../src/app/utils';
import { ErrorCollection } from '../../../../../../../src/app/models';
import { LicenseService } from './license.service';
import { DropdownStateSelector } from '../../../../../../../src/app/store/selectors';
import { DropdownModel } from '../../../../../../../src/app/services';

@Component({
    templateUrl: './license-form.component.html',
    animations: [fadeIn],
    styleUrls: ['./license.scss']
})
export class LicenseFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    licenseForm: FormGroup;

    @Select(DropdownStateSelector.SliceOf('SysModule')) module$: Observable<DropdownModel[]>;

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    modules: any[] = [
        { key: 1, value: 'neplus.module.hrm' },
        { key: 2, value: 'neplus.module.inventory' },
        { key: 3, value: 'neplus.module.DM' },
        { key: 4, value: 'neplus.module.dartachalani' },
        { key: 4, value: 'neplus.module.beruju' }
    ];

    requestTypes: any[] = [
        { key: 1, value: 'Trial' },
        { key: 2, value: 'Standard' },

    ];

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<LicenseFormComponent>,
        private licenseService: LicenseService
    ) {
        this.genericValidator = new GenericValidator({
            moduleName: {
                required: 'This field is required.'
            },
            requestType: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit(): void {
        this.initForm();
    }

    private initForm() {
        this.licenseForm = this.fb.group({
            id: 0,
            moduleName: [null, Validators.required],
            requestType: [null, Validators.required]
        });
        this.licenseForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.licenseForm.dirty || this.licenseForm.invalid]);
    }

    cancel() {
        if (this.licenseForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(
                    filter(_ => _)
                ).subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.licenseForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;
        let formData = [];
        formData.push(this.licenseForm.value);
        this.licenseService.createRequest(formData).subscribe(_ => console.log('Request send.'));
        this.dialogRef.close();
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.licenseForm, this.formInputElements)
            .subscribe(m => this.displayMessage = m);
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
