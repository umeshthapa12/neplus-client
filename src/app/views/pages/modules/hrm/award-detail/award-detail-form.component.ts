import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { Subject } from 'rxjs';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { AwardDetailService } from './award-detail.service';

@Component({
    templateUrl: './award-detail-form.component.html',
    styleUrls: ['./award-detail.component.scss']
})
export class AwardDetailFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    awardDetailForm: FormGroup;
    isWorking: boolean;
    displayMessage: any = {};
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];

    constructor(private cdr: ChangeDetectorRef,
                private fb: FormBuilder,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<AwardDetailFormComponent>,
                private awardDetailService: AwardDetailService,
                @Inject(MAT_DIALOG_DATA)
                public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must be rquired'
            },
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Approve' }
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.awardDetailForm = this.fb.group({
            id: 0,
            empCode: null,
            name: [null, Validators.required],
            value: null,
            date: null,
            dateNepali: null,
            description: null,
            status: 'Active',
        });
        this.awardDetailForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.awardDetailForm.invalid || this.awardDetailForm.dirty]);
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.awardDetailForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.awardDetailService.addOrUpdate(this.awardDetailForm.value)
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

    private patchForm(a: any) {
        this.awardDetailForm.patchValue({
            id: a.id,
            empCode: a.empCode,
            name: a.name,
            value: a.value,
            date: a.date,
            dateNepali: a.dateNepali,
            description: a.description,
            status: a.status,
        });
    }
    ngAfterViewInit() {
        this.genericValidator.initValidationProcess(this.awardDetailForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.awardDetailService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const a: any = res;
                    this.patchForm(a);
                });
        }
    }
    cancel() {
        if (this.awardDetailForm.dirty) {
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
