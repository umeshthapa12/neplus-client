import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ServiceService } from './service.service';

@Component({
    templateUrl: './service-form.component.html',
    styleUrls: ['./service.component.scss']
})
export class ServiceFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private toDestroy$ = new Subject<void>();
    serviceForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    genericValidator: GenericValidator;

    constructor(private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<ServiceFormComponent>,
                private serviceService: ServiceService,
                @Inject(MAT_DIALOG_DATA)
                 public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must be required',
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
        this.serviceForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            empCodePrefix: null,
            retirementAge: null,
            description: null,
            status: 'Active',
        });
        this.serviceForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.serviceForm.invalid || this.serviceForm.dirty]);
    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.serviceForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.serviceService.addOrUpdate(this.serviceForm.value)
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

    private patchForm(s: any) {
        this.serviceForm.patchValue({
            id: s.id,
            name: s.name,
            nameNepali: s.nameNepali,
            empCodePrefix: s.empCodePrefix,
            retirementAge: s.retirementAge,
            description: s.description,
            status: s.status,
        });
    }
    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.serviceForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.serviceService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const s: any = res;
                    this.patchForm(s);
                });
        }
    }
    cancel() {
        if (this.serviceForm.dirty) {
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
