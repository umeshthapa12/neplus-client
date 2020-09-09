import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { takeUntil, delay } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { JobService } from './job.service';

@Component({
    templateUrl: './job-form.component.html',
    styleUrls: ['./job.component.scss']
})
export class JobFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private toDestroy$ = new Subject<void>();
    jobForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    genericValidator: GenericValidator;
    isError: boolean;
    errors: any[];
    @ViewChildren(FormControlName, { read: ElementRef })
    public formInputElement: ElementRef[];

    constructor(private cdr: ChangeDetectorRef,
                private fb: FormBuilder,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<JobFormComponent>,
                private jobService: JobService,
                @Inject(MAT_DIALOG_DATA)
                public data: any,
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This is the Required Field'
            }
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Approved' }
    ];

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.jobForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            status: 'Active'
        });
        this.jobForm.valueChanges
            .subscribe(_ => this.dialogRef.disableClose = this.jobForm.dirty || this.jobForm.invalid);
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.jobForm);
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.jobService.addOrUpdate(this.jobForm.value)
            .pipe(takeUntil(this.toDestroy$),
                delay(1500))
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
    private patchForm(j: any) {
        this.jobForm.patchValue({
            id: j.id,
            name: j.name,
            nameNepali: j.nameNepali,
            status: j.status,
        });
    }

    ngAfterViewInit() {

        this.genericValidator
            .initValidationProcess(this.jobForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.jobService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const j: any = res;
                    this.patchForm(j);
                });
        }
    }

    cancel() { }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
