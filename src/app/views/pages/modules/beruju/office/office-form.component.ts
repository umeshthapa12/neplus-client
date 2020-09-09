import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChildren, ElementRef, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { filter, takeUntil, delay } from 'rxjs/operators';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { OfficeService } from './office.service';
import { fadeIn, GenericValidator, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { ResponseModel, ErrorCollection } from '../../../../../../../src/app/models';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './office-form.component.html',
    animations: [fadeIn],
    styleUrls: ['./office.scss']
})

export class OfficeFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    officeForm: FormGroup;
    isError: boolean;
    responseMessage: string;
    errors: any[];
    isWorking: boolean;

    displayMessage: any = {};

    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    status: any[] = [
        { id: 1, value: 'Active' },
        { id: 2, value: 'Inactive' }
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<OfficeFormComponent>,
        private oService: OfficeService,
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'कार्यालयको नाम अनिवार्य राख्नुहोस्'
            }
        });
    }

    ngOnInit() {
        this.initForms();
    }

    private initForms() {
        this.officeForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            status: null
        });

        this.officeForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.officeForm.dirty || this.officeForm.invalid]);
    }

    private patchForm(d: any) {
        this.cdr.markForCheck();

        this.officeForm.patchValue({
            id: d.id,
            name: d.name,
            status: d.status
        });
    }

    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    saveChanges() {
        // this.cdr.markForCheck();
        this.clearErrors();

        // invalid form without filling required fields
        const errorMessage = validateBeforeSubmit(this.officeForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;

        // this.oService.addOrUpdate(this.officeForm.value)
        this.oService.addOrUpdates(this.officeForm.value)
            .pipe(
                takeUntil(this.toDestroy$), delay(1500))
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
        if (this.officeForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(
                    filter(x => x)
                ).subscribe(x => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }

    }

    ngAfterViewInit() {
        this.validation();

        if (this.data.id > 0) {
            // get data by id from local repository.
            this.oService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                const d: any = r;
                this.patchForm(d);
            });
        }

        // Real Data
        // if (this.data.id > 0) {
        //     this.oService.getOfficeById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }
    }

    private validation() {
        this.genericValidator
            .initValidationProcess(this.officeForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
