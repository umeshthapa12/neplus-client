import {
    Component, OnInit, Inject, AfterViewInit, ViewChildren, ElementRef, OnDestroy, ChangeDetectorRef, ViewChild
} from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { filter, takeUntil, delay, tap } from 'rxjs/operators';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { fadeIn, GenericValidator, ExtendedMatDialog, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { ResponseModel, ErrorCollection } from '../../../../../../../src/app/models';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { BerujuService } from './beruju.service';
import { OfficeService } from '../office/office.service';
import { FiscalYearService } from '../fiscal-year/fiscal-year.service';
import { BerujuSectionService } from '../beruju-section/beruju-section.service';

@Component({
    templateUrl: './beruju-form.component.html',
    animations: [fadeIn],
    styleUrls: ['./beruju.scss']
})
export class BerujuFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    berujuForm: FormGroup;
    displayMessage: any = {};

    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    isError: boolean;
    responseMessage: string;
    errors: any[];
    isWorking: boolean;

    @ViewChild(CdkDrag)
    private readonly drag: CdkDrag;

    constructor(
        private cdr: ChangeDetectorRef,
        private bService: BerujuService,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<BerujuFormComponent>,
        private exDialog: ExtendedMatDialog,
        private oService: OfficeService,
        private fyService: FiscalYearService,
        private bsService: BerujuSectionService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'कार्यालयको नाम अनिवार्य राख्नुहोस्'
            },
            uncleanMoney: {
                required: 'अशुली अनिवार्य राख्नुहोस्'
            },
            regular: {
                required: 'नियमित अनिवार्य राख्नुहोस्'
            },
            privilegeMoney: {
                required: 'धरौटी अनिवार्य राख्नुहोस्'
            },
            persuadeMoney: {
                required: 'फछ्यौट रकम अनिवार्य राख्नुहोस्'
            },
        });
    }

    offices: any[] = [];
    fiscalYears: any[] = [];
    berujuSections: any[] = [];

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

        // Fiscal years
        this.fyService.getLists().pipe(
            takeUntil(this.toDestroy$))
            .subscribe({
                next: res => { this.fiscalYears = res; }
            });

        // this.fyService.getFiscalYears()
        //     .pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe({
        //         next: res => {
        //             this.cdr.markForCheck();
        //             this.fiscalYears = res;
        //         }
        //     });

        // Beruju Section
        this.bsService.getList().pipe(
            takeUntil(this.toDestroy$)
        ).subscribe({
            next: res => {
                this.berujuSections = res;
            }
        });

        // this.bsService.getBerujuSection()
        //     .pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe({
        //         next: res => {
        //             this.cdr.markForCheck();
        //             this.berujuSections = res;
        //         }
        //     });
    }

    ngOnInit() {
        this.initForm();
        this.getDropdowns();
    }

    private initForm() {
        this.berujuForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            uncleanMoney: [null, Validators.required],
            regular: [null, Validators.required],
            tax: null,
            mobilization: null,
            privilegeMoney: [null, Validators.required],
            persuadeMoney: [null, Validators.required],
            fiscalYear: null,
            berujuSection: null
        });

        this.berujuForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.berujuForm.dirty || this.berujuForm.invalid]);
    }

    private patchForm(d: any) {
        this.cdr.markForCheck();

        this.berujuForm.patchValue({
            id: d.id,
            name: d.name,
            uncleanMoney: d.uncleanMoney,
            regular: d.regular,
            tax: d.tax,
            mobilization: d.mobilization,
            privilegeMoney: d.privilegeMoney,
            persuadeMoney: d.persuadeMoney,
            fiscalYear: d.fiscalYear,
            berujuSection: d.berujuSection
        });
    }

    saveChanges() {
        this.clearErrors();
        const errorMessage = validateBeforeSubmit(this.berujuForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;
        this.bService.addOrUpdates(this.berujuForm.value)
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

    cancel() {
        if (this.berujuForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.berujuForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        // if (this.data.id > 0) {
        //     this.bService.getBerujuById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(800)
        //     ).subscribe(res => {
        //         const d: any = res.contentBody;
        //         this.patchForm(d);
        //     });
        // }
        if (this.data.id > 0) {
            this.bService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                const d: any = r;
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
