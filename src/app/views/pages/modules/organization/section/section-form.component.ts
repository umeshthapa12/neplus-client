import { takeUntil, delay, filter } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils/';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { ChangesConfirmComponent } from './../../../../shared';
import { SectionService } from './section.service';

@Component({
    templateUrl: './section-form.component.html',
    styleUrls: ['./section.component.scss']
})
export class SectionFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private toDestroy$ = new Subject<void>();
    displayMessage: any = {};
    sectionForm: FormGroup;
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];

    constructor(private cdr: ChangeDetectorRef,
                private fb: FormBuilder,
                private sectionService: SectionService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<SectionFormComponent>,
                @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must be required'
            },
        });
    }

    departments = [
        { key: 1, value: 'Manufacturing' },
        { key: 2, value: 'Supply' },
        { key: 3, value: 'Shaling' },
        { key: 4, value: 'Account' },
    ];

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Pending' },
        { key: 4, value: 'Approve' },
    ];

    ngOnInit() {
        this.initForm();
    }
    private initForm() {
        this.sectionForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            department: null,
            status: 'Active'
        });
        this.sectionForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.sectionForm.invalid || this.sectionForm.dirty]);
    }
    private patchForm(s: any) {
        this.sectionForm.patchValue({
            id: s.id,
            name: s.name,
            nameNepali: s.nameNepali,
            department: s.department,
            status: s.status,
        });
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.sectionForm)
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.sectionService.addOrUpdate(this.sectionForm.value)
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

                if (errors && errors.length) {
                    this.errors = errors;
                    this.displayMessage = model.messageBody;
                }
            });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.sectionForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.sectionService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const s: any = res;
                    this.patchForm(s);
                });
        }
    }


    cancel() {
        if (this.sectionForm.dirty) {
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
