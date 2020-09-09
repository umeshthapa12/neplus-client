import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, Inject, ChangeDetectorRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { PersuadeService } from './persuade.service';
import { filter, takeUntil, delay, tap } from 'rxjs/operators';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { fadeIn, GenericValidator, ExtendedMatDialog, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { ResponseModel, ErrorCollection } from '../../../../../../../src/app/models';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './persuade-form.component.html',
    animations: [fadeIn],
    styleUrls: ['./persuade.scss']
})

export class PersuadeFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    persuadeForm: FormGroup;

    isError: boolean;
    responseMessage: string;
    errors: any[];
    isWorking: boolean;

    @ViewChild(CdkDrag)
    private readonly drag: CdkDrag;

    displayMessage: any = {};
    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    roles: any[] = [
        { id: 1, value: 'Manager' },
        { id: 2, value: 'Employee' },
        { id: 3, value: 'Accountant' }
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<PersuadeFormComponent>,
        private pService: PersuadeService,
        private exDialog: ExtendedMatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This field is required.'
            },
            role: {
                requied: 'This field is required.'
            },
            address: {
                required: 'This field is required.'
            },
            email: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForms();
    }

    private initForms() {
        this.persuadeForm = this.fb.group({
            id: 1,
            name: null,
            roleId: null,
            address: null,
            userName: null,
            contactNumber: null,
            email: null
        });

        this.persuadeForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.persuadeForm.dirty || this.persuadeForm.invalid]);
    }

    private patchForm(d: any) {
        this.cdr.markForCheck();

        this.persuadeForm.patchValue({
            id: d.id,
            name: d.name,
            roleId: d.roleId,
            address: d.address,
            userName: d.userName,
            contactNumber: d.contactNumber,
            email: d.email
        });
    }

    saveChanges() {
        this.clearErrors();
        const errorMessage = validateBeforeSubmit(this.persuadeForm, document.querySelector('#res-messages'));
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;

        // this.pService.addOrUpdate(this.persuadeForm.value)
        this.pService.addOrUpdates(this.persuadeForm.value)
            .pipe(
                takeUntil(this.toDestroy$), delay(1500))
            .subscribe(res => {
                this.dialogRef.close(res);
                this.isWorking = false;
            }, e => {
                this.cdr.markForCheck();
                this.isError = true;
                this.isWorking = false;
                const model: ResponseModel = e.error;
                const errors: ErrorCollection[] = model.contentBody.errors;

                // Check if server returning number of error list, if so make these as string
                if (errors && errors.length > 0) {
                    this.errors = errors;
                    this.responseMessage = model.messageBody;
                }
            });
    }

    cancel() {
        if (this.persuadeForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.persuadeForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        // if (this.data.id > 0) {
        //     this.pService.getPersuadeById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(800)
        //     ).subscribe(res => {
        //         const d: any = res.contentBody;
        //         this.patchForm(d);
        //     });
        // }
        if (this.data.id > 0) {
            this.pService.getDataById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(res => {
                const d: any = res;
                this.patchForm(d);
            });
        }

        // makes transparent when dialog drag and move
        this.exDialog.makeTransparentWhenDragMmove(this.drag);
    }

    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
