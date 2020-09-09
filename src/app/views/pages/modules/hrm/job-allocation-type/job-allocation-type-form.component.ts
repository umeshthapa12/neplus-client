import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ErrorCollection, ResponseModel } from './../../../../../models';
import { ChangesConfirmComponent } from './../../../../shared';
import { JobAllocationTypeService } from './job-allocation-type.service';

@Component({
    templateUrl: './job-allocation-type-form.component.html',
    styleUrls: ['./job-allocation-type.component.scss']
})
export class JobAllocationTypeFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    jobAllocationTypeForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private jobAllocationService: JobAllocationTypeService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<JobAllocationTypeFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This is the required field',
            }
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Approve' },
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.jobAllocationTypeForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            isAllowChange: null,
            status: 'Active'
        });
        this.jobAllocationTypeForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.jobAllocationTypeForm.invalid || this.jobAllocationTypeForm.dirty]);
    }

    private patchForm(j: any) {
        this.jobAllocationTypeForm.patchValue({
            id: j.id,
            name: j.name,
            nameNepali: j.nameNepali,
            isAllowChange: j.isAllowChange,
            status: j.status,
        });
    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.jobAllocationTypeForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.jobAllocationService.addOrUpdate(this.jobAllocationTypeForm.value)
            .pipe(takeUntil(this.toDestroy$), delay(1500))
            .subscribe(res => {
                this.dialogRef.close(res);
                this.isWorking = false;
            }, e => {
                this.cdr.markForCheck();
                this.isWorking = false;
                this.isError = true;
                const model: ResponseModel = e.error;
                const errors: ErrorCollection[] = model.contentBody.errors;

                if (errors && errors.length > 0) {
                    this.errors = errors;
                    this.displayMessage = model.messageBody;
                }
            });
    }

    ngAfterViewInit() {
        this.genericValidator.initValidationProcess(this.jobAllocationTypeForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.jobAllocationService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const j: any = res;
                    this.patchForm(j);
                });
        }
    }
    cancel() {
        if (this.jobAllocationTypeForm.dirty) {
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
