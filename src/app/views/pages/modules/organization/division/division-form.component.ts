import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ChangesConfirmComponent } from './../../../../shared';
import { DivisionService } from './division.service';

@Component({
    templateUrl: './division-form.component.html',
    styleUrls: ['./division.component.scss']
})
export class DivisionFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    divisionForm: FormGroup;
    isWorking: boolean;
    displayMessage: any = {};
    isError: boolean;
    private genericValidator: GenericValidator;
    errors: any[];
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<DivisionFormComponent>,
                private divisionService: DivisionService,
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
        { key: 3, value: 'Approve' },
        { key: 4, value: 'Pending' }
    ];

    ngOnInit() {
        this.initForm();
    }

    initForm() {
        this.divisionForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            status: 'Active',
        });
        this.divisionForm.valueChanges.pipe(
            takeUntil(this.toDestroy$)
        ).subscribe(_ => [this.dialogRef.disableClose = this.divisionForm.dirty || this.divisionForm.invalid]);
    }

    patchForm(d: any) {
        this.divisionForm.patchValue({
            id: d.id,
            name: d.name,
            nameNepali: d.nameNepali,
            designationLevel: d.designationLevel,
            designationSalary: d.designationSalary,
            gradeRate: d.gradeRate,
            status: d.status
        });

    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.divisionForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.divisionService.addOrUpdate(this.divisionForm.value)
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

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.divisionForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.divisionService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(500))
                .subscribe(r => {
                    this.cdr.markForCheck();
                    const d: any = r;
                    this.patchForm(d);
                });
        }
    }
    cancel() {
        if (this.divisionForm.dirty) {
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
