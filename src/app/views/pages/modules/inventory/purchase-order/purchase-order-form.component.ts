import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { GenericValidator, validateBeforeSubmit, fadeIn, fadeInOutStagger } from '../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { PurchaseOrderService } from './purchase-order.service';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './purchase-order-form.component.html',
    animations: [fadeIn, fadeInOutStagger],
    styleUrls: ['./purchase-order.scss']
})
export class PurchaseOrderFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    poForm: FormGroup;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    suppliers: any[] = [
        { key: 1, value: 'Supplier 1' },
        { key: 2, value: 'Supplier 2' },
        { key: 3, value: 'Supplier 3' },
        { key: 4, value: 'Supplier 4' },
    ];

    status: any[] = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Rejected' },
        { key: 5, value: 'Approved' },
    ];

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<PurchaseOrderFormComponent>,
        private pService: PurchaseOrderService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({

        });
    }

    ngOnInit() {
        this.initForm();
    }


    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.poForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.pService.getPurchaseOrderById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }

        if (this.data.id > 0) {
            this.pService.getListById(this.data.id).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe({
                next: res => {
                    const d = res;
                    this.patchForm(d);
                }
            });
        }

    }

    private initForm() {
        this.poForm = this.fb.group({
            id: 0,
            storeName: null,
            supplierName: null,
            transactionDate: null,
            deliveryDate: null,
            orderStatus: null,
            description: null,
            remarks: null,
            itemTotalAmount: null,
            discount: null,
            taxableAmount: null,
            taxAmount: null,
            totalAmount: null
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.poForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.poForm.dirty || this.poForm.invalid]);
    }

    private patchForm(d) {
        this.poForm.patchValue({
            id: d.id,
            storeName: d.storeName,
            supplierName: d.supplierName,
            transactionDate: d.transactionDate,
            deliveryDate: d.deliveryDate,
            orderStatus: d.orderStatus,
            description: d.description,
            remarks: d.remarks,
            itemTotalAmount: d.itemTotalAmount,
            discount: d.discount,
            taxableAmount: d.taxableAmount,
            taxAmount: d.taxAmount,
            totalAmount: d.totalAmount
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.poForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        this.isWorking = true;

        this.pService.addOrUpdate(this.poForm.value)
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

    cancel() {
        if (this.poForm.dirty) {
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
