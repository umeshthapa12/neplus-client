import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericValidator, validateBeforeSubmit } from '../../../../../utils';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { ChangesConfirmComponent } from './../../../../shared';
import { DeputationService } from './deputation.service';

@Component({
    templateUrl: './deputation-form.component.html',
    styleUrls: ['./deputation.component.scss']
})
export class DeputationFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    deputationForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    displayMessage: any = {};
    public genericValidator: GenericValidator;
    errors: any[];
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private fb: FormBuilder,
                private deputationService: DeputationService,
                private dialogRef: MatDialogRef<DeputationFormComponent>,
                @Inject(MAT_DIALOG_DATA)
                public data: any,
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This is the Required Field',
            }
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Approve' },
        { key: 4, value: 'Pending' },
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.deputationForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            status: 'Active'
        });
        this.deputationForm.valueChanges.pipe(
            takeUntil(this.toDestroy$))
            .subscribe(_ => [this.dialogRef.disableClose = this.deputationForm.dirty || this.deputationForm.invalid]);
    }


    private patchForm(d: any) {
        this.deputationForm.patchValue({
            id: d.id,
            name: d.name,
            nameNepali: d.nameNepali,
            status: d.status,
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.deputationForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.deputationService.addOrUpdate(this.deputationForm.value)
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
            .initValidationProcess(this.deputationForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.deputationService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$),
                    delay(500))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const d: any = res;
                    this.patchForm(d);
                });
        }
    }


    cancel() {
        if (this.deputationForm.dirty) {
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
