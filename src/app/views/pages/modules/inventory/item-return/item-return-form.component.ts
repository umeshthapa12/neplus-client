import { ItemReturnService } from './item-return.service';
import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { filter, takeUntil, delay } from 'rxjs/operators';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { GenericValidator, fadeIn, fadeInOutStagger, validateBeforeSubmit } from '../../../../../../app/utils';

@Component({
    templateUrl: './item-return-form.component.html',
    animations: [fadeIn, fadeInOutStagger],
    styleUrls: ['./item-return.component.css']
})
export class ItemReturnFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    itemReturnForm: FormGroup;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<ItemReturnFormComponent>,
        private irService: ItemReturnService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            transactionDate: {
                required: 'This field is required.'
            }
        });
    }

    status: any[] = [
       {key: 1, value: 'Active'},
       {key: 2, value: 'Inactive'},
       {key: 3, value: 'Pending'},
       {key: 4, value: 'Approve'},
    ];

    users: any[] = [
        {key: 1 , value: 'Chandra prakash'},
        {key: 2 , value: 'Gokul'},
        {key: 3 , value: 'Saroj'},
    ];

    storeNames: any[] = [
        {key: 1, value: 'ABC store'},
        {key: 2, value: 'XYZ store'},
    ];

    ngOnInit() {
        this.initForm();
        // console.log(this.data);

    }

    private initForm() {
        this.itemReturnForm = this.fb.group({
            id: 0,
            transactionDate: [null, Validators.required],
            returnToStore: null,
            returnBy: null,
            remarks: null,
            sendNotification: null,
            status: 'Active'
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.itemReturnForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.itemReturnForm.dirty || this.itemReturnForm.invalid]);
    }

    private patchForm(data) {
        this.itemReturnForm.patchValue({
            id: data.id,
            transactionDate: data.transactionDate,
            returnToStore: data.returnToStore,
            returnBy: data.returnBy,
            remarks: data.remarks,
            sendNotification: data.sendNotification,
            status: data.status
        });

    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.itemReturnForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        this.isWorking = true;

        if (this.data.id > -1) {
            this.irService.updata(this.itemReturnForm.value)

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

            this.irService.add(this.itemReturnForm.value)
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
        if (this.itemReturnForm.dirty) {
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
            .initValidationProcess(this.itemReturnForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.irService.getitemReturnById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }

        if (this.data.id > 0) {
            this.irService.getListById(this.data.id).pipe(
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
