import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, Inject, ViewChildren, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { ErrorCollection, ResponseModel } from '../../../../../../../../src/app/models';
import { GenericValidator, validateBeforeSubmit, fadeIn } from '../../../../../../../../src/app/utils';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { TravelDetailsService } from './travel-details.service';

@Component({
    templateUrl: './travel-details-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class TravelDetailsFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    travelDetailsForm: FormGroup;

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
        private dialogRef: MatDialogRef<TravelDetailsFormComponent>,
        private travelService: TravelDetailsService,
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This fiels is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.travelDetailsForm = this.fb.group({
            id: 0,
            empCode: null,
            name: [null, Validators.required],
            travelMode: null,
            place: null,
            dateFrom: null,
            dateTo: null,
            description: null,
            status: 'Active'
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.travelDetailsForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.travelDetailsForm.dirty || this.travelDetailsForm.invalid]);
    }

    private patchForm(d: any) {
        this.travelDetailsForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            name: d.name,
            travelMode: d.travelMode,
            place: d.place,
            dateFrom: d.dateFrom,
            dateTo: d.dateTo,
            description: d.description,
            status: d.status
        });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.travelDetailsForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        /** Gets and patch editable data  by ID from the API */
        if (this.data.id > 0) {
            this.travelService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                let d: any = r;
                this.patchForm(d);
            });
        }
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.travelDetailsForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.travelService.addOrUpdate(this.travelDetailsForm.value)
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
        if (this.travelDetailsForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(
                    filter(_ => _)
                ).subscribe(_ => this.dialogRef.close());
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

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
