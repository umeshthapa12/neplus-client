import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, ViewChildren, ElementRef, OnDestroy, AfterViewInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ChangesConfirmComponent } from './../../../../shared';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { LocationService } from './location.service';

@Component({
    templateUrl: './location-form.component.html',
    styleUrls: ['./location.component.scss']
})
export class LocationFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private toDestroy$ = new Subject<void>();
    locationForm: FormGroup;
    displayMessage: any = {};
    errors: any[];
    isWorking: boolean;
    isError: boolean;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElement: ElementRef[];
    genericValidator: GenericValidator;

    constructor(private cdr: ChangeDetectorRef,
                private fb: FormBuilder,
                private locationService: LocationService,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<LocationFormComponent>,
                @Inject(MAT_DIALOG_DATA)
                 public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name Must Be Required'
            },
            district: {
                required: 'This is the Required Field'
            },
            country: {
                required: 'This is the Required Field'
            },
        });
    }

    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },

    ];

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.locationForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            district: [null, Validators.required],
            country: [null, Validators.required],
            description: null,
            status: 'Active',
        });
        this.locationForm.valueChanges
            .subscribe(_ => [this.dialogRef.disableClose = this.locationForm.invalid || this.locationForm.dirty]);
    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.locationForm)
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.locationService.addOrUpdate(this.locationForm.value)
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
                const errors: ErrorCollection[] = model.contentBody;

                if (errors && errors.length > 0) {
                    this.errors = errors;
                    this.displayMessage = model.messageBody;
                }
            });
    }

    private patchForm(l: any) {
        this.locationForm.patchValue({
            id: l.id,
            name: l.name,
            nameNepali: l.nameNepali,
            district: l.district,
            country: l.country,
            description: l.description,
            status: l.status,
        });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.locationForm, this.formInputElement)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.locationService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(600))
                .subscribe(res => {
                    this.cdr.markForCheck();
                    const l: any = res;
                    this.patchForm(l);
                });
        }
    }
    cancel() {
        if (this.locationForm.dirty) {
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
