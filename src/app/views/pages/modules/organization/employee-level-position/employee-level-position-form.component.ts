import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ChangesConfirmComponent } from './../../../../shared/';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { EmployeeLevelPositionService } from './employee-level-position.service';

@Component({
    templateUrl: './employee-level-position-form.component.html',
    styleUrls: ['./employee-level-position.component.scss']
})
export class EmployeeLevelPositionFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    employeeLevelPositionForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    errors: any[];

    constructor(private cdr: ChangeDetectorRef,
                private fb: FormBuilder,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<EmployeeLevelPositionFormComponent>,
                private employeeLevelService: EmployeeLevelPositionService,
                @Inject(MAT_DIALOG_DATA)
                public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must be required'
            },
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Approve' },
        { key: 4, value: 'Pending' }
    ];

    services = [
        { key: 1, value: 'Management' },
        { key: 2, value: 'Production' },
        { key: 3, value: 'Manufacturing' },
        { key: 4, value: 'Delevery' }
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.employeeLevelPositionForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            serviceGroup: null,
            description: null,
            status: 'Active',
        });
        this.employeeLevelPositionForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.employeeLevelPositionForm.invalid || this.employeeLevelPositionForm.dirty]);
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.employeeLevelPositionForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.employeeLevelService.addOrUpdate(this.employeeLevelPositionForm.value)
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

    private pathForm(e: any) {
        this.employeeLevelPositionForm.patchValue({
            id: e.id,
            name: e.name,
            nameNepali: e.nameNepali,
            serviceGroup: e.serviceGroup,
            description: e.description,
            status: e.status,
        });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.employeeLevelPositionForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.employeeLevelService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const e: any = res;
                    this.pathForm(e);
                });
        }
    }

    cancel() {
        if (this.employeeLevelPositionForm.dirty) {
            this.dialog.open(ChangesConfirmComponent)
                .afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => [this.dialogRef.close()]);
        } else {
            this.dialogRef.close();
        }
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
