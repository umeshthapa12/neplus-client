import { Component, OnInit, ViewChildren, ElementRef, ChangeDetectorRef, Inject, OnDestroy } from '@angular/core';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { AssetIssueService } from './asset-issue.service';
import { fadeIn, GenericValidator, validateBeforeSubmit } from '../../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../../src/app/models';

@Component({
    templateUrl: './asset-issue-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class AssetIssueFormComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    assetIssueForm: FormGroup;

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
        { key: 1, value: '77/78' }
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<AssetIssueFormComponent>,
        private assetIssueService: AssetIssueService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            assetCode: {
                required: 'This field is required.'
            },
            name: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.assetIssueForm = this.fb.group({
            id: 0,
            empCode: null,
            assetCode: [null, Validators.required],
            name: [null, Validators.required],
            value: null,
            issuedForName: null,
            issueDate: null,
            issueDateUpTo: null,
            returnStatus: null,
            returnToName: null,
            returnDate: null,
            description: null,
            status: 'Active'
        });


        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.assetIssueForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.assetIssueForm.dirty || this.assetIssueForm.invalid]);
    }

    private patchForm(d: any) {
        this.assetIssueForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            assetCode: d.assetCode,
            name: d.name,
            value:d.value,
            issuedForName: d.issuedForName,
            issueDate: d.issueDate,
            issueDateUpTo: d.issueDateUpTo,
            returnStatus: d.returnStatus,
            returnToName: d.returnToName,
            returnDate: d.returnDate,
            description: d.description,
            status: d.status
        });
    }

    saveChanges() {
        console.log(this.assetIssueForm.value);
        const errorMessage = validateBeforeSubmit(this.assetIssueForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.assetIssueService.addOrUpdate(this.assetIssueForm.value)
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
        if (this.assetIssueForm.dirty) {
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
            .initValidationProcess(this.assetIssueForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.assetIssueService.getListById(this.data.id).pipe(
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
