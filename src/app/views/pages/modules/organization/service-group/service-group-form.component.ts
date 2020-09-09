import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { ChangesConfirmComponent } from './../../../../shared';
import { ServiceGroupService } from './service-group.service';

@Component({
    selector: 'app-service-group-form',
    templateUrl: './service-group-form.component.html',
    styleUrls: ['./service-group.component.scss']
})
export class ServiceGroupFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private toDestroy$ = new Subject<void>();
    serviceGroupForm: FormGroup;
    isWorking: boolean;
    displayMessage: any = {};
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    genericValidator: GenericValidator;
    isError: boolean;
    errors: any[];

    constructor(private cdr: ChangeDetectorRef,
                private fb: FormBuilder,
                private serviceGroupService: ServiceGroupService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<ServiceGroupFormComponent>,
                @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name Must be Required'
            },
        });
    }
    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
    ];
    services = [
        { key: 1, value: 'concierge' },
        { key: 2, value: 'Delevery' },
        { key: 3, value: 'Cash' },
    ];

    ngOnInit() {
        this.initForm();
    }
    private initForm() {
        this.serviceGroupForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            service: null,
            description: null,
            status: 'Active'
        });
        this.serviceGroupForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.serviceGroupForm.dirty || this.serviceGroupForm.invalid]);
    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.serviceGroupForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.serviceGroupService.addOrUpdate(this.serviceGroupForm.value)
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

    private patchForm(s: any) {
        this.serviceGroupForm.patchValue({
            id: s.id,
            name: s.name,
            nameNepali: s.nameNepali,
            service: s.service,
            description: s.description,
            status: s.status,
        });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.serviceGroupForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.serviceGroupService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const s: any = res;
                    this.patchForm(s);
                });
        }
    }
    cancel() {
        if (this.serviceGroupForm.dirty) {
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
