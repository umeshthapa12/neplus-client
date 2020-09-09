import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, OnDestroy, Inject, ViewChildren, ElementRef, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { EmployeeRankService } from './employee-rank.service';

@Component({
    templateUrl: './employee-rank-form.component.html',
    styleUrls: ['./employee-rank.component.scss']
})
export class EmployeeRankFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    employeeRankForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private employeeRankService: EmployeeRankService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<EmployeeRankFormComponent>,
                @Inject(MAT_DIALOG_DATA)
                public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name Must Be required'
            }
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.employeeRankForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            status: 'Active',
        });
        this.employeeRankForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.employeeRankForm.invalid || this.employeeRankForm.dirty]);
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.employeeRankForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.employeeRankService.addOrUpdate(this.employeeRankForm.value)
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
    private patchForm(e: any) {
        this.employeeRankForm.patchValue({
            id: e.id,
            name: e.name,
            nameNepali: e.nameNepali,
            status: e.status,
        });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.employeeRankForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.employeeRankService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const e: any = res;
                    this.patchForm(e);
                });
        }
    }

    cancel() {
        if (this.employeeRankForm.dirty) {
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
