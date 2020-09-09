import {
    Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef, Inject, ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { fadeIn, fadeInOutStagger, GenericValidator, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { DartaService } from './darta.service';
import { BranchService } from '../branch/branch.service';

@Component({
    templateUrl: './darta-form.component.html',
    animations: [fadeIn, fadeInOutStagger],
    styleUrls: ['./darta.scss']
})

export class DartaFormComponent implements OnInit, AfterViewInit, OnDestroy {

    /**
     * Create a toDestroy$ property. Subject is like EventEmitters it maintain a registry of many listeners.
     */
    private readonly toDestroy$ = new Subject<void>();

    /**
     * Darta FormGroup name
     */
    dartaForm: FormGroup;

    /**
     * Create variables for displaying any error or success message.
     */
    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    /**
     * displaying static value of fiscal year.
     */
    fiscalYear = '2076/77';

    /** Displaying letter types on form selection */
    letterKinds: any[] = [
        { key: 1, value: 'प्रशासन शाखा' },
        { key: 2, value: 'आर्थिक प्रशासन शाखा' },
        { key: 3, value: 'प्राबिधिक शाखा' },
        { key: 4, value: 'राजस्व शाखा' },
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

    // For upload file
    files: any = [];

    /**
     * Created displayMessage property for displaying form validation messages.
     * Created genericValidator with type GenericValidator used for form validation in component and set validation message.
     */
    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dService: DartaService,
        private bService: BranchService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<DartaFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        /** Set the require message on required controls. */
        this.genericValidator = new GenericValidator({
            regNo: {
                required: 'दर्ता नम्बर अनिवार्य राख्नुहोस्'
            },
            subject: {
                required: 'बिषय अनिवार्य राख्नुहोस्'
            },
            letterKind: {
                required: 'पत्रको किसिम अनिवार्य राख्नुहोस्'
            },
            senderOfficeName: {
                required: 'पठाउने कार्यालय/ईकाई/व्यक्ति वा शाखाको नाम अनिवार्य राख्नुहोस्'
            },
            noOfLetter: {
                required: 'पत्र संख्या अनिवार्य राख्नुहोस्'
            },
            letterRegNo: {
                required: 'पत्रको चलानी नम्बर अनिवार्य राख्नुहोस्'
            }
        });
    }

    /** Get the list of branches from branch service and assign it into branches array. */
    getBranches() {
        // this.bService.getList().subscribe(_ => this.branches = _);
    }

    ngOnInit() {
        this.initForm();
        this.getBranches();
    }

    /** Construct form controls with form builder */
    private initForm() {
        this.dartaForm = this.fb.group({
            id: 0,
            regNo: [null, Validators.required],
            subject: [null, Validators.required],
            letterKind: [null, Validators.required],
            senderOfficeName: [null, Validators.required],
            senderOfficeAddress: null,
            letterRegNo: [null, Validators.required],
            noOfLetter: [null, Validators.required],
            branchIds: null,
            remarks: null,
            doc: null,
            isCorrect: [null, Validators.required]
        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.dartaForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.dartaForm.dirty || this.dartaForm.invalid]);
    }

    private patchForm(d: any) {
        this.cdr.markForCheck();
        this.dartaForm.patchValue({
            id: d.id,
            regNo: d.regNo,
            subject: d.subject,
            letterKind: d.letterKind,
            senderOfficeName: d.senderOfficeName,
            senderOfficeAddress: d.senderOfficeAddress,
            letterRegNo: d.letterRegNo,
            noOfLetter: d.noOfLetter,
            branchIds: d.branchIds,
            remarks: d.remarks,
            isCorrect: d.isCorrect
        });
        this.branches = d.branchIds;
        this.letterKinds = d.letterKind;
    }

    saveChanges() {
        console.log(this.dartaForm.value);
        const errorMessage = validateBeforeSubmit(this.dartaForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;

        if (this.data.id > -1) {
            this.dService.update(this.dartaForm.value)
                // this.dService.addOrUpdate(this.dForm.value)
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

            this.dService.add(this.dartaForm.value)
                // this.dService.addOrUpdate(this.dForm.value)
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

    cancel() {
        if (this.dartaForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(
                    filter(_ => _)
                ).subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.dartaForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.bService.getListById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }

        if (this.data.id > 0) {
            this.dService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                const d: any = r;
                this.patchForm(d);
            });
        }
    }

    /** Resets error state values */
    clearErrors() {
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    // File upload
    uploadFile(event) {
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.files.push(element.name);
        }
    }

    /** Remove uploaded file from array */
    deleteAttachment(index) {
        this.files.splice(index, 1);
    }
}
