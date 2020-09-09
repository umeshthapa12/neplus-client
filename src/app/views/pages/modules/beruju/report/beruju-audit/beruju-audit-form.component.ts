import {
    Component, OnInit, ChangeDetectorRef, OnDestroy, ViewChildren, ElementRef, Inject, AfterViewInit, ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import Quill from 'quill';
import { fadeIn, GenericValidator, QuilljsService, validateBeforeSubmit } from '../../../../../../../../src/app/utils';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { ResponseModel, ErrorCollection } from '../../../../../../../../src/app/models';
import { BerujuAuditService } from './beruju-audit.service';

@Component({
    templateUrl: './beruju-audit-form.component.html',
    animations: [fadeIn],
    styleUrls: ['./beruju-audit.scss']
})

export class BerujuAuditFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    isWorking: boolean;

    berujuAuditForm: FormGroup;
    genericValidator: GenericValidator;

    displayMessage: any = {};
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    isError: boolean;
    responseMessage: string;
    errors: any[];

    quill$: Quill;
    @ViewChild('auditBody', { read: ElementRef, })
    private bodyEl: ElementRef;

    constructor(
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<BerujuAuditFormComponent>,
        private fb: FormBuilder,
        private baService: BerujuAuditService,
        private quilljsService: QuilljsService,
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {
        this.genericValidator = new GenericValidator({
            title: {
                required: 'This field is required.'
            },
            subject: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForms();
    }

    private initForms() {
        this.berujuAuditForm = this.fb.group({
            id: 0,
            title: [null, Validators.required],
            letterNo: null,
            subject: [null, Validators.required],
            body: null,
            address: null,
            alternativeAddress: null
        });

        this.berujuAuditForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.berujuAuditForm.dirty || this.berujuAuditForm.invalid]);
    }

    private patchForm(d: any) {
        this.cdr.markForCheck();

        this.berujuAuditForm.patchValue({
            id: d.id,
            title: d.title,
            subject: d.subject,
            letterNo: d.letterNo,
            address: d.address,
            body: d.body,
            alternativeAddress: d.alternativeAddress
        });
    }

    cancel() {
        if (this.berujuAuditForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(
                    takeUntil(this.toDestroy$),
                    filter(_ => _)
                ).subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }

    }
    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    saveChanges() {
        // this.cdr.markForCheck();
        this.clearErrors();

        // invalid form without filling required fields
        const errorMessage = validateBeforeSubmit(this.berujuAuditForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;

        // this.baService.addOrUpdate(this.berujuAuditForm.value)
        this.baService.addOrUpdates(this.berujuAuditForm.value)
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

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.berujuAuditForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        this.quill$ = this.quilljsService
            .initQuill(this.bodyEl)
            .textChangeValueSetter(this.berujuAuditForm.get('body'), 'html')
            .getQuillInstance();

        if (this.data.id > 0) {
            this.baService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                const d: any = r;
                this.patchForm(d);
                this.quill$.root.innerHTML = d.body;
            });
        }

        // Real Data
        // if (this.data.id > 0) {
        //     this.fyService.getFiscalYearById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
