import { Component, OnInit, AfterViewInit, OnDestroy, ChangeDetectorRef, ViewChildren, ElementRef, Inject } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControlName, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericValidator, validateBeforeSubmit, fadeIn } from '../../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../../src/app/models';
import { TraningDetailsService } from './traning-details.service';
import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './traning-details-form.component.html',
    styleUrls: ['../employee.scss'],
    animations: [fadeIn]
})
export class TraningDetailsFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    traningDetailsForm: FormGroup;

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    traningType: any[] = [
        {key: 1, value: 'System Design'}
    ];
    countries: any[] = [
        {key: 1, value: 'Nepal'}
    ];
    selection: any[] = [
        {key: 1, value: 'Selection 1'}
    ];
    fiscalYears: any[] = [
        {key: 1, value: '077/78'}
    ];
    status: any[] = [
        {key: 1, value: 'Active'},
        {key: 2, value: 'Inactive'},
        {key: 3, value: 'Pending'},
        {key: 4, value: 'Rejected'},
    ];

    nextPhase: boolean = false;

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<TraningDetailsFormComponent>,
        private traningDetailsService: TraningDetailsService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This field is required.'
            },
            traningType: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
        console.log(this.data);
    }

    private initForm() {
        this.traningDetailsForm = this.fb.group({
            id: 0,
            empCode: null,
            name: [null, Validators.required],
            dateFrom: null,
            dateTo: null,
            provider: null,
            traningType: [null, Validators.required],
            country: null,
            place: null,
            traningHour: null,
            traningCost: null,
            selection: null,
            grade: null,
            countAsTraning: null,
            previousContinue: null,
            previousTraningNo: null,
            nextPhase: null,
            intervalDays: null,
            nextPhaseDeclaredBy: null,
            nextPhaseRemarks: null,
            description: null,
            fiscalYear: null,
            year: null,
            days: null,
            status: 'Active'
        });

        this.traningDetailsForm.get('nextPhase').valueChanges.subscribe(_ => {this.nextPhase = _; console.log(_);});

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.traningDetailsForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.traningDetailsForm.dirty || this.traningDetailsForm.invalid]);
    }

    private patchForm(d: any) {
        this.traningDetailsForm.patchValue({
            id: d.id,
            empCode: d.empCode,
            name: d.name,
            dateFrom: d.dateFrom,
            dateTo: d.dateTo,
            provider: d.provider,
            traningType: d.traningType,
            country: d.country,
            place: d.place,
            traningHour: d.traningHour,
            traningCost: d.traningCost,
            selection: d.selection,
            grade: d.grade,
            countAsTraning: d.countAsTraning,
            previousContinue: d.previousContinue,
            previousTraningNo: d.previousTraningNo,
            nextPhase: d.nextPhase,
            intervalDays: d.intervalDays,
            nextPhaseDeclaredBy: d.nextPhaseDeclaredBy,
            nextPhaseRemarks: d.nextPhaseRemarks,
            description: d.description,
            fiscalYear: d.fiscalYear,
            year: d.fiscalYear,
            days: d.days,
            status: d.status
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.traningDetailsForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.traningDetailsService.addOrUpdate(this.traningDetailsForm.value)
            // this.iService.addOrUpdate(this.iForm.value)
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
        if (this.traningDetailsForm.dirty) {
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
            .initValidationProcess(this.traningDetailsForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.traningDetailsService.getListById(this.data.id).pipe(
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
}
