import { Component, OnInit, ViewChildren, ElementRef, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormControlName, FormBuilder } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorCollection, ResponseModel } from '../../../../../../../../src/app/models';
import { GenericValidator, validateBeforeSubmit, fadeIn } from '../../../../../../../../src/app/utils';
import { AssetService } from './asset.service';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './asset-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class AssetFormComponent implements OnInit, AfterViewInit, OnDestroy {

    private readonly toDestroy$ = new Subject<void>();

    assetsForm: FormGroup;

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    status: any[] = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Rejected' },
    ];

    fiscalYear: any[] = [
        {key: 1, value: '77/78'}
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AssetFormComponent>,
        private assetsService: AssetService,
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
        this.assetsForm = this.fb.group({
            id: 0,
            empCode: null,
            assetName: null,
            ownerName: null,
            quantity: null,
            costValue: null,
            currentValue: null,
            sourceOfIncome: null,
            fiscalYear: null,
            assetDate: null,
            description: null,
            status: 'Active'
        });


        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.assetsForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.assetsForm.dirty || this.assetsForm.invalid]);
    }

    private patchForm(d: any) {
        this.assetsForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            assetName: d.assetsName,
            ownerName: d.ownerName,
            quantity: d.quantity,
            costValue: d.costValue,
            currentValue: d.currentValue,
            sourceIncome: d.sourceIncome,
            fiscalYear: d.fiscalYear,
            assetsDate: d.assetsDate,
            description: d.description,
            status: d.status
        });
    }

    saveChanges() {
        console.log(this.assetsForm.value);
        const errorMessage = validateBeforeSubmit(this.assetsForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.assetsService.addOrUpdate(this.assetsForm.value)
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
        if (this.assetsForm.dirty) {
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
            .initValidationProcess(this.assetsForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.assetsService.getListById(this.data.id).pipe(
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
