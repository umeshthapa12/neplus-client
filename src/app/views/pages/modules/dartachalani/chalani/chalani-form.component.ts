import { Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, Inject, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { ChalaniService } from './chalani.service';
import { fadeIn, GenericValidator, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { ResponseModel, ErrorCollection } from '../../../../../../../src/app/models';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { BranchService } from '../branch/branch.service';

@Component({
    templateUrl: './chalani-form.component.html',
    styleUrls: ['./chalani.scss'],
    animations: [fadeIn]
})
export class ChalaniFormComponent implements OnInit, AfterViewInit, OnDestroy {
    /**
     * Create a toDestroy$ property. Subject is like EventEmitters it maintain a registry of many listeners.
     */
    private readonly toDestroy$ = new Subject<void>();

    /**
     * Chalani FormGroup name
     */
    chalaniForm: FormGroup;

    /**
     * Create variables for displaying any error or success message.
     */
    responseMessage: string;
    errors: any;
    isError: boolean;
    isWorking: boolean;

    /**
     * It is used to add remove and display file list.
     */
    files: any[] = [];

    /**
     * displaying static value of fiscal year.
     */
    fiscalYear = '2076/77';

    /** Displaying value of receivers form control selection */
    letterReceivers: any[] = [{ key: 1, value: 'नेपाल सरकार संघिय मामिला तथा सामान्य प्रशासन मन्त्रालय' }];

    /**
     * Created displayMessage property for displaying form validation messages.
     * Created genericValidator with type GenericValidator used for form validation in component and set validation message.
     */
    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    /** Displaying letter types on form selection */
    LetterKinds: any[] = [
        { key: 1, value: 'प्रशासन शाखा' },
        { key: 2, value: 'आर्थिक प्रशासन शाखा' },
        { key: 3, value: 'प्राबिधिक शाखा' },
        { key: 4, value: 'राजस्व   शाखा' },
    ];

    /** Displaying branches on branch control selection */
    branches: any[] = [
        { key: 31, sn: 1, value: 'काठमाडौँ' },
        { key: 311, sn: 2, value: 'कास्की' },
        { key: 422, sn: 3, value: 'मोरंग' },
        { key: 532, sn: 4, value: 'कन्द्रिय समन्वय इकाई' },
        { key: 234, sn: 5, value: 'स्थानीय तह समन्वय शाखा' },
        { key: 1242, sn: 6, value: 'प्रसासन योजना महाशाखा' },
        { key: 4312, sn: 7, value: 'आर्थिक प्रसासन महाशाखा' }
    ];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private cService: ChalaniService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<ChalaniFormComponent>,
        private bService: BranchService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        /** Set the require message on required controls. */
        this.genericValidator = new GenericValidator({
            invoiceNo: {
                required: 'चलानी नम्बर अनिवार्य राख्नुहोस्'
            },
            subject: {
                required: 'बिषय अनिवार्य राख्नुहोस्'
            },
            officeAddress: {
                required: 'पत्र पाउने कार्यालयको ठेगाना अनिवार्य राख्नुहोस्'
            },
            branchIds: {
                required: 'चलानी गर्ने शाखा अनिवार्य राख्नुहोस्'
            }
        });
    }

    ngOnInit() {
        this.getBranch();
        this.initForm();
    }

    /** Get the list of branches from branch service and assign it into branches array. */
    getBranch() {
        // this.bService.getList().subscribe(_ => this.branches = _);
    }

    /** Construct form controls with form builder */
    private initForm() {
        this.chalaniForm = this.fb.group({
            chalaniForm: 0,
            invoiceNo: [null, Validators.required],
            branchIds: null,
            receivers: null,
            // date: null,
            subject: [null, Validators.required],
            LetterKindId: [null, Validators.required],
            officeAddress: [null, Validators.required],
            isCorrect: [null, Validators.required],
            remarks: null,
            doc: null
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.chalaniForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.chalaniForm.dirty || this.chalaniForm.invalid]);
    }

    /** Function which set the forms value from given parameter */
    private patchForm(d: any) {
        this.cdr.markForCheck();
        this.chalaniForm.patchValue({
            id: d.id,
            invoiceNo: d.invoiceNo,
            branchIds: d.branchIds,
            receivers: d.receivers,
            date: d.date,
            subject: d.subject,
            LetterKindId: d.LetterKindId,
            officeAddress: d.officeAddress,
            isCorrect: d.isCorrect,
            remarks: d.remarks
        });
        this.letterReceivers = d.receivers;
        this.branches = d.branchIds;
        this.LetterKinds = d.LetterKindId;
    }

    ngAfterViewInit() {
        this.validation();

        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.cService.getChalaniById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }

        if (this.data.id > 0) {
            this.cService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                const d: any = r;
                this.patchForm(d);
            });
        }
    }

    private validation() {
        this.genericValidator
            .initValidationProcess(this.chalaniForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
    }

    saveChanges() {
        // invalid form without filling required fields
        const errorMessage = validateBeforeSubmit(this.chalaniForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;

        if (this.data.id > -1) {
            // this.cService.addOrUpdate(this.cForm.value)
            this.cService.update(this.chalaniForm.value)
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

                    // Check if server returning number of error list, if so make these as string
                    if (errors && errors.length > 0) {
                        this.errors = errors;
                        this.responseMessage = model.messageBody;
                    }
                });
        } else {
            this.cService.add(this.chalaniForm.value)
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

                    // Check if server returning number of error list, if so make these as string
                    if (errors && errors.length > 0) {
                        this.errors = errors;
                        this.responseMessage = model.messageBody;
                    }
                });
        }

    }

    /** Resets error state values */
    clearErrors() {
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    cancel() {
        if (this.chalaniForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(
                    filter(_ => _)
                ).subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    // File upload
    uploadFile(event) {
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.files.push(element.name);
        }
    }

    /** Remove uploaded file from array */
    deleteFile(index) {
        this.files.splice(index, 1);
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
