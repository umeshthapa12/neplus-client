import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseModel, ErrorCollection } from './../../../../../models/app.model';
import { ChangesConfirmComponent } from './../../../../shared';
import { GenericValidator, validateBeforeSubmit } from '../../../../../utils';
import { RemunerationService } from './remuneration.service';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';


@Component({
    templateUrl: './remuneration-group-form.component.html',
    styleUrls: ['./remuneration-group.component.scss']
})
export class RemunerationGroupFormComponent implements OnInit, OnDestroy, AfterViewInit {

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<RemunerationGroupFormComponent>,
                private remunerationService: RemunerationService,
                @Inject(MAT_DIALOG_DATA)
        public data: { id: number },
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must be required',
            }
        });
    }
    private toDestroy$ = new Subject<void>();
    remunerationForm: FormGroup;
    isWorking: boolean;
    displayMessage: any = {};
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    public useDefult: boolean;


    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'INactive' },
    ];

    remunerations = [
        { key: 1, value: 'Commission' },
        { key: 2, value: 'Bonous' },
        { key: 3, value: 'Wage' },
    ];

        attendances = [
        { key: 1, value: 'Work Time' },
        { key: 2, value: 'Over Time' },
        { key: 3, value: 'Travel Time' },
    ];


   public isChange(event) {
        this.useDefult = event.checked;
        // if (event.checked) {
        //     return true;
        // } else {
        //     return false;
        // }
    }
    ngOnInit() {
        this.initForm();
        console.log(this.data);
    }

    private initForm() {
        this.remunerationForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            standardSalaryCalDay: null,
            attandanceCalType: null,
            isApplyOT: false,
            isCountAsEmp: false,
            isApplyOffDay: false,
            isOffDayAsOT: false,
            remunerationType: false,
            isCheck24hourDuty: false,
            isNeedLateApproval: false,
            monthlyOTLimit: false,
            isCheckHalfAttendance: false,
            isNoAttendance: false,
            status: 'Active'
        });
        this.remunerationForm.valueChanges
            .subscribe(_ => this.dialogRef.disableClose = this.remunerationForm.dirty || this.remunerationForm.invalid);
    }

    private patchForm(r: any) {
        this.remunerationForm.patchValue({
            id: r.id,
            name: r.name,
            nameNepali: r.nameNepali,
            standardSalaryCalDay: r.standardSalaryCalDay,
            attandanceCalType: r.attandanceCalType,
            isApplyOT: r.isApplyOT,
            isCountAsEmp: r.isCountAsEmp,
            isApplyOffDay: r.isApplyOffDay,
            isOffDayAsOT: r.isOffDayAsOT,
            remunerationType: r.remunerationType,
            isCheck24hourDuty: r.isCheck24hourDuty,
            isNeedLateApproval: r.isNeedLateApproval,
            monthlyOTLimit: r.monthlyOTLimit,
            isCheckHalfAttendance: r.isCheckHalfAttendance,
            isNoAttendance: r.isNoAttendance,
            status: r.status,

        });
    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.remunerationForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        console.log(this.remunerationForm.value);
        this.remunerationService.addOrUpdate(this.remunerationForm.value)
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
                    this.displayMessage = model.messageBody;
                }
            });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.remunerationForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.remunerationService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const r: any = res;
                    this.patchForm(r);
                });
        }
    }
    cancel() {
        if (this.remunerationForm.dirty) {
            this.dialog.open(ChangesConfirmComponent)
                .afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
