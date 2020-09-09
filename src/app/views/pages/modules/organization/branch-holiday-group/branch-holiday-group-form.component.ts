import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { BranchHolidayGroupService } from './branch-holiday-group.service';

@Component({
    templateUrl: './branch-holiday-group-form.component.html',
    styleUrls: ['./branch-holiday-group.component.scss']
})
export class BranchHolidayGroupFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    branchHolidayForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    displayMessage: any = {};
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];

    constructor(private cdr: ChangeDetectorRef,
                private fb: FormBuilder,
                private branchHolidayService: BranchHolidayGroupService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<BranchHolidayGroupFormComponent>,
                @Inject(MAT_DIALOG_DATA)
                public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must be required',
            },
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Approve' }
    ];

    ngOnInit() {
        this.initForm();

    }

    initForm() {
        this.branchHolidayForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            status: 'Active',
        });
        this.branchHolidayForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.branchHolidayForm.invalid || this.branchHolidayForm.dirty]);
    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.branchHolidayForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.branchHolidayService.addOrUpdate(this.branchHolidayForm.value)
            .pipe(takeUntil(this.toDestroy$), delay(1500))
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
    private patchForm(h: any) {
        this.branchHolidayForm.patchValue({
            id: h.id,
            name: h.name,
            nameNepali: h.nameNepali,
            status: h.status,
        });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.branchHolidayForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.branchHolidayService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const h: any = res;
                    this.patchForm(h);
                });
        }
    }
    cancel() {
        if (this.branchHolidayForm.dirty) {
            this.dialog.open(ChangesConfirmComponent)
                .afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => [this.dialogRef.close()]);
        } else {
            this.dialogRef.close();
        }
     }
    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
