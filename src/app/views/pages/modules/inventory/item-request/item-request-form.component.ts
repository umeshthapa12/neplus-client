import { Component, OnInit, OnDestroy, ChangeDetectorRef, ViewChildren, ElementRef, Inject, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { ItemRequestService } from './item-request.service';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { fadeIn, fadeInOutStagger, GenericValidator, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';

@Component({
    templateUrl: './item-request-form.component.html',
    animations: [fadeIn, fadeInOutStagger],
    styleUrls: ['./item-request.scss']
})
export class ItemRequestFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    irForm: FormGroup;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    files: any[] = [];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<ItemRequestFormComponent>,
        private iService: ItemRequestService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({

        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.irForm = this.fb.group({
            id: 0,
            storeName: null,
            storeRequest: null,
            requestedby: null,
            projectFor: null,
            approvalRequestTo: null,
            reqDescription: null,
            totalQty: '2010 Units',
            requestedDate: '2020',
            file: null
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.irForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.irForm.dirty || this.irForm.invalid]);
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.irForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.iService.getitemRequestById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }

        if (this.data.id > 0) {
            this.iService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                const d: any = r;
                this.patchForm(d);
            });
        }
    }

    private patchForm(d) {
        this.irForm.patchValue({
            id: d.id,
            storeName: d.storeName,
            storeRequest: d.storeRequest,
            requestedby: d.requestedby,
            projectFor: d.projectFor,
            approvalRequestTo: d.approvalRequestTo,
            reqDescription: d.reqDescription
        });

    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.irForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        this.isWorking = true;
        if (this.data.id > 0) {
        this.iService.update(this.irForm.value)
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
        } else  {
            console.log(this.irForm.value);
            this.iService.add(this.irForm.value)
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
        if (this.irForm.dirty) {
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
