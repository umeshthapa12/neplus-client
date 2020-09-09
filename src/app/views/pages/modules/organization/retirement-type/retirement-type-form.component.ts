import { ChangesConfirmComponent } from './../../../../shared/changes-confirm/changes-confirm.component';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { RetirementTypeService } from './retirement-type.service';

@Component({
    templateUrl: './retirement-type-form.component.html',
    styleUrls: ['./retirement-type.component.scss']
})
export class RetirementTypeFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private todestroy$ = new Subject<void>();
    retirementTypeForm: FormGroup;
    displayMessage: any = {};
    errors: any[];
    genericValidator: GenericValidator;
    isWorking: boolean;
    isError: boolean;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    constructor(private fb: FormBuilder,
                private retirementService: RetirementTypeService,
                private dialog: MatDialog,
                private dialofRef: MatDialogRef<RetirementTypeFormComponent>,
                private cdr: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA)
                public data: { id: number },
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
        { key: 4, value: 'Pending' },
    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.retirementTypeForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            status: 'Active'
        });
        this.retirementTypeForm.valueChanges
            .subscribe(_ => [this.dialofRef.disableClose = this.retirementTypeForm.invalid || this.retirementTypeForm.dirty]);
    }


    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.retirementTypeForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.retirementService.addOrUpdata(this.retirementTypeForm.value)
            .pipe(takeUntil(this.todestroy$), delay(1500))
            .subscribe(res => {
                this.dialofRef.close(res);
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

    private patchForm(r: any) {
        this.retirementTypeForm.patchValue({
            id: r.id,
            name: r.name,
            nameNepali: r.nameNepali,
            status: r.status,
        });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.retirementTypeForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.retirementService.getListById(this.data.id)
                .pipe(takeUntil(this.todestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const r: any = res;
                    this.patchForm(r);
                });
        }
    }

    cancel() {
        if (this.retirementTypeForm.dirty) {
            this.dialog.open(ChangesConfirmComponent)
                .afterClosed()
                .pipe(takeUntil(this.todestroy$),
                    filter(_ => _))
                .subscribe(_ => this.dialofRef.close());
        } else {
            this.dialofRef.close();
        }
    }
    ngOnDestroy() {
        this.todestroy$.next();
        this.todestroy$.complete();
    }

}
