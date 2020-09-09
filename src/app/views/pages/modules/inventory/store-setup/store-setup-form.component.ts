import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Component, OnInit, Inject, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { fadeIn, fadeInOutStagger } from '../../../../../utils';
import { ChangesConfirmComponent } from './../../../../shared/changes-confirm/changes-confirm.component';
import { StoreSetupService } from './store-setup.service';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils/validations/generic-validators';
import { ErrorCollection, ResponseModel } from './../../../../../models/app.model';

@Component({
    //   selector: 'app-store-setup-form',
    templateUrl: './store-setup-form.component.html',
    animations: [fadeIn, fadeInOutStagger],
    styleUrls: ['./store-setup.component.css']

})
export class StoreSetupFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly todestroy$ = new Subject<void>();
    storeSetupForm: FormGroup;
    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<StoreSetupFormComponent>,
        private storeSetupService: StoreSetupService,
        private cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            storeCode: {
                required: 'This field is required.'
            },
            storeName: {
                required: 'This field is required.'
            }
        });
    }

    branchName: any[] = [
        { key: 1, value: 'Butwal' },
        { key: 2, value: 'Baglung' },
        { key: 3, value: 'Bardeya' },
        { key: 4, value: 'Balawaa' },
        { key: 5, value: 'Kathmandu' },
    ];

    stores: any[] = [
        { key: 1, value: 'Electronic' },
        { key: 2, value: 'Vehicle' },
        { key: 3, value: 'Kitchen' },
        { key: 4, value: 'IT' }
    ];

    status: any[] = [
        { key: 1, value: 'Active' },
        { key: 1, value: 'Inactive' }
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.storeSetupForm = this.fb.group({
            id: 0,
            storeCode: [null, Validators.required],
            storeName: [null, Validators.required],
            underStore: null,
            branchName: null,
            status: 'Active',
        });
        this.storeSetupForm.valueChanges.pipe(
            takeUntil(this.todestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.storeSetupForm.dirty || this.storeSetupForm.invalid]);
    }

    private patchForm(d: any) {
        this.cdr.markForCheck();
        this.storeSetupForm.patchValue({
            id: d.id,
            storeCode: d.storeCode,
            storeName: d.storeName,
            underStore: d.underStore,
            branchName: d.branchName,
            status: d.status,
        });
    }

    saveChanges() {
        this.clearErrors();
        const errorMessage = validateBeforeSubmit(this.storeSetupForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        if (this.data.id > -1) {
            this.storeSetupService.update(this.storeSetupForm.value)
                .pipe(takeUntil(this.todestroy$),
                    delay(1500))
                .subscribe(_ => {
                    this.dialogRef.close(_);
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

        } else {
            this.storeSetupService.add(this.storeSetupForm.value)
                .pipe(
                    takeUntil(this.todestroy$),
                    delay(1500)
                )
                .subscribe(_ => {
                    this.dialogRef.close(_);
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
    }

    cancel() {
        if (this.storeSetupForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }

    }

    /** Resets error state values */
    clearErrors() {
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.storeSetupForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.storeSetupService.getListById(this.data.id)
                .pipe(takeUntil(this.todestroy$),
                    delay(500))
                .subscribe(s => {
                    const d: any = s;
                    this.patchForm(d);
                });
        }

    }

    ngOnDestroy() {
        this.todestroy$.next();
        this.todestroy$.complete();
    }
}
