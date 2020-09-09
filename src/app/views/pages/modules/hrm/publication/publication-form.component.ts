import { takeUntil, delay, filter } from 'rxjs/operators';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, OnDestroy, ChangeDetectorRef, Inject, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { PublicationService } from './publication.service';

@Component({
    templateUrl: './publication-form.component.html',
    styleUrls: ['./publication.component.scss']
})
export class PublicationFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    publicationForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputForm: ElementRef[];

    constructor(private fb: FormBuilder,
                private cdr: ChangeDetectorRef,
                private publicatoService: PublicationService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<PublicationFormComponent>,
                @Inject(MAT_DIALOG_DATA)
                public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            publicationTitle: {
                required: 'Publication Title Must be Required',
            },
        });
    }
    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' }
    ];

    ngOnInit() {
        this.initForm();
        console.log(this.data);
    }

    private initForm() {
        this.publicationForm = this.fb.group({
            id: 0,
            empCode: null,
            publicationTitle: [null, Validators.required],
            publicationMarks: null,
            publicationDate: null,
            publicationDateNepali: null,
            status: 'Active',
            description: null,
        });
    }

    private patchForm(p: any) {
        this.publicationForm.patchValue({
            id: p.id,
            empCode: p.empCode,
            publicationTitle: p.publicationTitle,
            publicationMarks: p.publicationMarks,
            publicationDate: p.publicationDate,
            publicationDateNepali: p.publicationDateNepali,
            status: p.status,
            description: p.description,
        });
        this.publicationForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.publicationForm.invalid || this.publicationForm.dirty]);
    }

    saveChanges() {

        const errorMessage = validateBeforeSubmit(this.publicationForm)
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.publicatoService.addOrUpdate(this.publicationForm.value)
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

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.publicationForm, this.formInputForm)
            .subscribe(m => this.displayMessage = m);

        if (this.data.id > 0) {
            this.publicatoService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const p: any = res;
                    this.patchForm(p);
                });
        }
    }
    cancel() {
        if (this.publicationForm.dirty) {
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
