import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { UnitService } from './unit.service';
import { fadeIn, collectionInOut } from '../../../../../../app/utils';
import { ErrorCollection, ResponseModel } from './../../../../../models/app.model';
import { ChangesConfirmComponent } from './../../../../shared/changes-confirm/changes-confirm.component';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils/validations/generic-validators';

@Component({
    //   selector: 'app-unit-form',
    templateUrl: './unit-form.component.html',
    animations: [fadeIn, collectionInOut],
    styleUrls: ['./unit.component.scss']
})
export class UnitFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();

    uForm: FormGroup;

    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    isWorking: boolean;
    responseMessage: string;
    displayMessage: any = {};
    isError: boolean;
    errors: ErrorCollection[];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<UnitFormComponent>,
        private uService: UnitService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }) {
        this.genericValidator = new GenericValidator({
            unitName: {
                required: 'This field is required.'
            },
        });
    }

    status: any[] = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Rejected' },
        { key: 5, value: 'Approve' },
    ];

    ngOnInit() {
        this.initForm();
    }
    private initForm() {
        this.uForm = this.fb.group({
            id: 0,
            unitName: [null, Validators.required],
            status: 'Active',
        });
    }

    private patchform(data) {
        this.uForm.patchValue({
            id: data.id,
            unitName: data.unitName,
            status: data.status,
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.uForm, document.querySelector('#res-message'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;
        if (this.data.id > -1) {
            this.uService.updata(this.uForm.value)
                .pipe(
                    takeUntil(this.toDestroy$),
                    delay(1500))
                .subscribe(res => {
                    this.dialogRef.close(res);
                    this.isWorking = false;
                }, e => {
                    this.cdr.markForCheck();
                    this.isError = true;
                    this.isWorking = false;
                    const model: ResponseModel = e.error;
                    const errors: ErrorCollection[] = model.contentBody.errors;


                    if (errors && errors.length > 0) {
                        this.errors = errors;
                        this.responseMessage = model.messageBody;
                    }
                });

        } else {
            this.uService.add(this.uForm.value)
                .pipe(
                    takeUntil(this.toDestroy$),
                    delay(1500))
                .subscribe(res => {
                    this.dialogRef.close(res);
                    this.isWorking = false;
                }, e => {
                    this.cdr.markForCheck();
                    this.isError = true;
                    this.isWorking = false;
                    const model: ResponseModel = e.error;
                    const errors: ErrorCollection[] = model.contentBody.errors;

                    if (errors && errors.length > 0) {
                        this.errors = errors;
                        this.responseMessage = model.messageBody;
                    }
                });
        }
    }

    cancel() {
        if (this.uForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(
                    filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.uForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.uService.getListById(this.data.id)
                .pipe(
                    takeUntil(this.toDestroy$),
                    delay(500))
                .subscribe(r => {
                    const d: any = r;
                    this.patchform(d);
                });
        }
    }

    clearErrors() {
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
