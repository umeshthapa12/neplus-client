import { ChangesConfirmComponent } from './../../../../shared/changes-confirm/changes-confirm.component';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, OnDestroy, AfterViewInit, ElementRef } from '@angular/core';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ContractPeriodService } from './contract-period.service';
import { Subject } from 'rxjs';


@Component({
    templateUrl: './contract-period-type-form.component.html',
    styleUrls: ['./contract-period-type.component.scss'],
})
export class ContractPeriodTypeFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    contractPeriodTypeForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];
    errors: any[];
    responseMessage: string;
    constructor(private cdr: ChangeDetectorRef,
                private contractPeriodService: ContractPeriodService,
                private dialog: MatDialog,
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<ContractPeriodTypeFormComponent>,
                @Inject(MAT_DIALOG_DATA)
                public data: any,
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name Must Be Required'
            }
        });
    }



    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Approve' },
        { key: 3, value: 'Pending' }
    ];



    ngOnInit() {
        this.initForm();
        //   console.log(this.data);
    }

    private initForm() {
        this.contractPeriodTypeForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            status: 'Active'
        });
        this.contractPeriodTypeForm.valueChanges
            .pipe(takeUntil(this.toDestroy$))
            .subscribe(_ => [this.dialogRef.disableClose = this.contractPeriodTypeForm.dirty || this.contractPeriodTypeForm.invalid]);
    }
    saveChanges() {
        // this.clearErrors();
        const errorMessage = validateBeforeSubmit(this.contractPeriodTypeForm, document.querySelector(`#res-message`));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.contractPeriodService.addOrUpdate(this.contractPeriodTypeForm.value)
            // this.branchService.addOrUpdate(this.branchForm.value)
            .pipe(takeUntil(this.toDestroy$),
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

                if (errors && errors.length > 0) {
                    this.errors = errors;
                    this.responseMessage = model.messageBody;
                }
            });
    }

    private patchForm(c: any) {
        this.contractPeriodTypeForm.patchValue({
            id: c.id,
            name: c.name,
            nameNepali: c.name,
            status: c.status,
        });
    }

    ngAfterViewInit() {


        this.genericValidator
            .initValidationProcess(this.contractPeriodTypeForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.contractPeriodService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$),
                    delay(500))
                .subscribe(r => {
                    const d: any = r;
                    this.patchForm(d);
                });
        }
    }


    cancel() {
        if (this.contractPeriodTypeForm.dirty) {
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
