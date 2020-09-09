import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChildren, ElementRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BerujuReportService } from './beruju-report.service';
import { fadeIn, GenericValidator, validateBeforeSubmit } from '../../../../../../../../src/app/utils';
import { ResponseModel, ErrorCollection } from '../../../../../../../../src/app/models';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { OfficeService } from '../../office/office.service';

@Component({
    templateUrl: './beruju-report-form.component.html',
    animations: [fadeIn],
    styleUrls: ['./beruju-report.scss']
})

export class BerujuReportFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    brForm: FormGroup;
    displayMessage: any = {};

    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    isError: boolean;
    responseMessage: string;
    errors: any[];
    isWorking: boolean;

    offices: any[] = [];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<BerujuReportFormComponent>,
        private brService: BerujuReportService,
        private oService: OfficeService,
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'नाम अनिवार्य राख्नुहोस्'
            },
            totalMoney: {
                required: 'जम्मा रकम अनिवार्य राख्नुहोस्'
            }
        });
    }

    private getDropdowns() {
        // Offices
        this.oService.getList().pipe(
            takeUntil(this.toDestroy$))
            .subscribe({
                next: res => { this.offices = res; }
            });

        // this.oService.getOffices()
        // .pipe(
        //     takeUntil(this.toDestroy$),
        //     delay(500)
        // ).subscribe({
        //     next: res => {
        //         this.cdr.markForCheck();
        //         this.offices = res;
        //     }
        // });
    }

    ngOnInit() {
        this.initForms();
        this.getDropdowns();
    }

    private initForms() {
        this.brForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            totalMoney: [null, Validators.required],
            persuadeMoney: null,
            balance: null
        });
    }

    private patchForm(d: any) {
        this.brForm.patchValue({
            id: d.id,
            name: d.name,
            totalMoney: d.totalMoney,
            persuadeMoney: d.persuadeMoney,
            balance: d.balance
        });
    }

    ngAfterViewInit() {
        this.validation();

        if (this.data.id > 0) {
            this.brService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                const d: any = r;
                this.patchForm(d);
            });
        }

        // Real Data
        // if (this.data.id > 0) {
        //     this.brService.getBerujuReportById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }
    }

    saveChanges() {
        console.log(this.brForm.value);
        // this.cdr.markForCheck();
        this.clearErrors();

        // invalid form without filling required fields
        const errorMessage = validateBeforeSubmit(this.brForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;

        // this.brService.addOrUpdate(this.brForm.value)
        this.brService.addOrUpdates(this.brForm.value)
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

    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    cancel() {
        if (this.brForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(takeUntil(this.toDestroy$),
                    filter(_ => _),
                    delay(500))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }

    }

    private validation() {
        this.genericValidator
            .initValidationProcess(this.brForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }


}

