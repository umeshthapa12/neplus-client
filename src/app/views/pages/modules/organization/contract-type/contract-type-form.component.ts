import { ChangesConfirmComponent } from './../../../../shared/changes-confirm/changes-confirm.component';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ViewChildren, ElementRef, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit } from '@angular/core';
import { ContractTypeService } from './contract-type.service';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';



@Component({
    selector: 'app-contract-type-form',
    templateUrl: './contract-type-form.component.html',
    styleUrls: ['./contract-type.component.scss']
})
export class ContractTypeFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    contractTypeForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    displayMessage: any = {};
    responseMessage: string;
    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(private fb: FormBuilder,
                private contractTypeService: ContractTypeService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<ContractTypeFormComponent>,
                private cdr: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA)
                public data: any,
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must me required'
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
        this.initData();
    }

    private initData() {
        this.contractTypeForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            durationMonth: null,
            status: 'Active',
        });
    }


    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.contractTypeForm, document.querySelector(`#res-message`));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.contractTypeService.addOrUpdate(this.contractTypeForm.value)
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
                    this.responseMessage = model.messageBody;
                }
            });
    }

    private patchForm(c: any) {
        this.contractTypeForm.patchValue({
            id: c.id,
            name: c.name,
            nameNepali: c.nameNepali,
            durationMonth: c.durationMonth,
            status: c.status,
        });
    }
    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.contractTypeForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.contractTypeService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$),
                    delay(500))
                .subscribe(res => {
                    const d: any = res;
                    this.patchForm(d);
                });
        }
    }

    cancel() {
        if (this.contractTypeForm.dirty) {
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
