import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, ChangeDetectorRef, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { GenericValidator, validateBeforeSubmit, fadeIn, fadeInOutStagger } from '../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { PurchaseOrderFormComponent } from '../purchase-order/purchase-order-form.component';
import { PurchaseRecordService } from './purchase-record.service';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './purchase-record-form.component.html',
    animations: [fadeIn, fadeInOutStagger],
    styleUrls: ['./purchase-record.scss']
})
export class PurchaseRecordFormComponent implements OnInit, AfterViewInit, OnDestroy {

    private readonly toDestroy$ = new Subject<void>();

    purchaseRecordForm: FormGroup;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    files: any[] = [];
    suppliers: any[] = [
        { key: 1, value: 'Supplier 1' },
        { key: 2, value: 'Supplier 2' },
        { key: 3, value: 'Supplier 3' },
        { key: 4, value: 'Supplier 4' },
    ];

    stores: any[] = [
        { key: 1, value: 'Store 1' },
        { key: 2, value: 'Store 2' },
        { key: 3, value: 'Store 3' },
        { key: 4, value: 'Store 4' },
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private purchaseRecordService: PurchaseRecordService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<PurchaseOrderFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            transactionDate: {
                required: 'This field is required.'
            },
            supplierName: {
                required: 'This field is required.'
            },
            storeName: {
                required: 'This field is required.'
            },
            itemTotalAmount: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.purchaseRecordForm = this.fb.group({
            id: 0,
            transactionDate: [null, Validators.required],
            supplierName: [null, Validators.required],
            storeName: [null, Validators.required],
            purchaseBillDate: null,
            purchaseBillNo: null,
            itemTotalAmount: [null, Validators.required],
            discount: null,
            taxableAmount: null,
            taxAmount: null,
            totalAmount: null
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.purchaseRecordForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.purchaseRecordForm.dirty || this.purchaseRecordForm.invalid]);
    }

    private patchForm(d: any) {
        this.cdr.markForCheck();
        this.purchaseRecordForm.patchValue({
            id: d.id,
            transactionDate: d.transactionDate,
            supplierName: d.supplierName,
            storeName: d.storeName,
            purchaseBillDate: d.purchaseBillDate,
            purchaseBillNo: d.purchaseBillNo,
            itemTotalAmount: d.itemTotalAmount,
            discount: d.discount,
            taxableAmount: d.taxableAmount,
            taxAmount: d.taxAmount,
            totalAmount: d.totalAmount
        });
        // this.suppliers = d.supplierName;
        // this.stores = d.stores;
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.purchaseRecordForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        this.isWorking = true;

        if (this.data.id > -1) {
            this.purchaseRecordService.update(this.purchaseRecordForm.value)
                // this.dService.addOrUpdate(this.dForm.value)
                .pipe(
                    takeUntil(this.toDestroy$),
                    delay(1500))
                .subscribe(res => {
                    console.log(res);
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
            this.purchaseRecordService.add(this.purchaseRecordForm.value)
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
        if (this.purchaseRecordForm.dirty) {
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
            .initValidationProcess(this.purchaseRecordForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.purchaseRecordService.getListById(this.data.id).subscribe({
                next: res => {
                    const d = res;
                    this.patchForm(d);
                }
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
