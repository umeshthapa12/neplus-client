import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { filter, takeUntil, delay } from 'rxjs/operators';

import { ItemSetupService } from './item-setup.service';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { GenericValidator, fadeIn, fadeInOutStagger, validateBeforeSubmit } from '../../../../../../app/utils';

@Component({
    templateUrl: './item-setup-form.component.html',
    animations: [fadeIn, fadeInOutStagger],
    styleUrls: ['./item-setup.scss']
})
export class ItemSetupFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    itemSetupForm: FormGroup;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    files: any[] = [];

    unitName: any[] = [
        { key: 1, value: 'Unit XQM' },
        { key: 2, value: 'Unit PAR' },
        { key: 3, value: 'Unit OAR' },
        { key: 4, value: 'Unit XAI' },
    ];

    groupNames: any[] = [
        {key: 1, value: 'Stationery'},
        {key: 2, value: 'Printing'},
        {key: 3, value: 'Cheque'},
        {key: 4, value: 'Stamp Print'},
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<ItemSetupFormComponent>,
        private isService: ItemSetupService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            itemName: {
                required: 'This field is required.'
            },
            groupName: {
                required: 'This field is required.'
            },
            minStockQty: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.itemSetupForm = this.fb.group({
            id: 0,
            itemCode: null,
            itemName: [null, Validators.required],
            groupName: [null, Validators.required],
            unitName: null,
            purchaseRate: null,
            minStockQty: [null, Validators.required],
            remarks: null,
            file: null
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.itemSetupForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.itemSetupForm.dirty || this.itemSetupForm.invalid]);
    }

    private patchForm(data) {
        this.itemSetupForm.patchValue({
            id: data.id,
            itemName: data.itemName,
            itemCode: data.itemCode,
            groupName: data.groupName,
            unitName: data.unitName,
            purchaseRate: data.purchaseRate,
            minStockQty: data.minStockQty,
            remarks: data.remarks
        });
    }

    saveChanges() {

        const errorMessage = validateBeforeSubmit(this.itemSetupForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        this.isWorking = true;

        if (this.data.id > -1) {
            this.isService.update(this.itemSetupForm.value)
                // this.dService.addOrUpdate(this.dForm.value)
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
        } else {

            this.isService.add(this.itemSetupForm.value)
                // this.dService.addOrUpdate(this.dForm.value)
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
    }

    cancel() {
        if (this.itemSetupForm.dirty) {
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
            .initValidationProcess(this.itemSetupForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.isService.getitemSetupById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }

        if (this.data.id > 0) {
            this.isService.getListById(this.data.id).pipe(
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

    // File upload
    uploadFile(event) {
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.files.push(element.name);
        }
    }

    /** Remove uploaded file from array */
    deleteAttachment(index) {
        this.files.splice(index, 1);
    }
}
