
import { Component, OnInit, ChangeDetectorRef, ViewChildren, ElementRef, Inject, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { fadeIn, GenericValidator, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseModel, ErrorCollection } from '../../../../../../../src/app/models';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { BerujuSectionService } from './beruju-section.service';

@Component({
    templateUrl: './beruju-section-form.component.html',
    animations: [fadeIn],
    styleUrls: ['./beruju-section.scss']
})
export class BerujuSectionFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    bsForm: FormGroup;

    genericValidator: GenericValidator;
    isError: boolean;
    responseMessage: string;
    errors: any[];
    isWorking: boolean;

    displayMessage: any = {};
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    status: any[] = [
        { id: 1, value: 'Active' },
        { id: 1, value: 'Inactive' },
        { id: 1, value: 'Pending' },
        { id: 1, value: 'Approved' },
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<BerujuSectionFormComponent>,
        private bsService: BerujuSectionService,
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {
        this.genericValidator = new GenericValidator({
            title: {
                required: 'शीर्षक अनिवार्य राख्नुहोस्'
            },
            content: {
                required: 'ब्यहोरा अनिवार्य राख्नुहोस्'
            },
            sectionNo: {
                required: 'बेरुजुको दफा नं अनिवार्य राख्नुहोस्'
            }
        });
    }

    ngOnInit() {
        this.initForms();
    }

    private initForms() {
        this.bsForm = this.fb.group({
            id: 0,
            sectionNo: [null, Validators.required],
            title: [null, Validators.required],
            content: [null, Validators.required],
            status: null
        });

        this.bsForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.bsForm.dirty || this.bsForm.invalid]);
    }

    private patchForm(d: any) {
        this.cdr.markForCheck();

        this.bsForm.patchValue({
            id: d.id,
            sectionNo: d.sectionNo,
            title: d.title,
            content: d.content,
            status: d.status
        });
    }

    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    saveChanges() {
        console.log(this.bsForm.value);
        // this.cdr.markForCheck();
        this.clearErrors();

        // invalid form without filling required fields
        const errorMessage = validateBeforeSubmit(this.bsForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;

        this.bsService.addOrUpdates(this.bsForm.value)
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
        if (this.bsForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(
                    filter(_ => _)
                ).subscribe(x => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }

    }

    ngAfterViewInit() {
        this.validation();

        if (this.data.id > 0) {
            this.bsService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                const d: any = r;
                this.patchForm(d);
            });
        }

        // Real Data
        // if (this.data.id > 0) {
        //     this.bsService.getBerujuSectionById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }
    }

    private validation() {
        this.genericValidator
            .initValidationProcess(this.bsForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
