import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { Component, OnInit, Inject, ChangeDetectorRef, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { BankAccountDetailsService } from './bank-account-details.service';

@Component({
    templateUrl: './bank-account-details-form.component.html',
    styleUrls: ['./bank-account-details.component.scss']
})
export class BankAccountDetailsFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    bankAccountDetailForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];

    constructor(private fb: FormBuilder,
                private bankAccountService: BankAccountDetailsService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<BankAccountDetailsFormComponent>,
                private cdr: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA)
                 public data: { id: number, }
    ) {
        this.genericValidator = new GenericValidator({
            bankName: {
                required: 'This is the required field',
            },
            bankBranchName: {
                required: 'This is the required field'
            },
            bankAccountNumber: {
                required: 'This is the required field'
            }
        });
    }
    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Approve' },
        { key: 2, value: 'Pending' },
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.bankAccountDetailForm = this.fb.group({
            id: 0,
            empCode: null,
            bankName: [null, Validators.required],
            bankBranchName: [null, Validators.required],
            bankAccountNumber: [null, Validators.required],
            status: 'Active',
        });
        this.bankAccountDetailForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.bankAccountDetailForm.invalid || this.bankAccountDetailForm.dirty]);
    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.bankAccountDetailForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.bankAccountService.addOrUpdate(this.bankAccountDetailForm.value)
            .pipe(takeUntil(this.toDestroy$), delay(1500))
            .subscribe(res => {
                this.dialogRef.close(res);
                this.isWorking = false;
            }, e => {
                this.cdr.markForCheck();
                this.isWorking = false;
                this.isError = true;
                const model: ResponseModel = e.error;
                const errors: ErrorCollection[] = model.contentBody.erros;

                if (errors && errors.length > 0) {
                    this.errors = errors;
                    this.displayMessage = model.messageBody;
                }
            });
    }

    private patchForm(b: any) {
        this.bankAccountDetailForm.patchValue({
            id: b.id,
            empCode: b.empCode,
            bankName: b.bankName,
            bankBranchName: b.bankBranchName,
            bankAccountNumber: b.bankAccountNumber,
            status: b.status,
        });
    }

    ngAfterViewInit() {
        this.genericValidator.initValidationProcess(this.bankAccountDetailForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.bankAccountService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const b: any = res;
                    this.patchForm(b);
                });
        }
    }
    cancel() {
        if (this.bankAccountDetailForm.dirty) {
            this.dialog.open(ChangesConfirmComponent)
                .afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
