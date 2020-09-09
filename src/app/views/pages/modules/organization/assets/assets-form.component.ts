import { takeUntil, delay, filter } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Component, OnInit, Inject, ChangeDetectorRef, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';
import { GenericValidator, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { AssetsService } from './assets.service';

@Component({
    templateUrl: './assets-form.component.html',
    styleUrls: ['./assets.component.scss'],

})
export class AssetsFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    assetsForm: FormGroup;
    displayMessage: any = {};
    isWorking: boolean;
    isError: boolean;
    errors: any[];
    responseMessage: string;
    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(private fb: FormBuilder,
                private dialog: MatDialog,
                private dialogRef: MatDialogRef<AssetsFormComponent>,
                private assetsService: AssetsService,
                private cdr: ChangeDetectorRef,
                @Inject(MAT_DIALOG_DATA)
                public data: any
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'Name must be Required'
            },
        });
    }

    status: any[] = [
        // {key: 1, value: 'Active'},
        // {key: 2, value: 'Inactive'},
        // {key: 3, value: 'Pending'},
        // {key: 4, value: 'Approved'}
    ];


    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.assetsForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            status: 'Active',
        });
        this.assetsForm.valueChanges.pipe(
            takeUntil(this.toDestroy$))
            .subscribe(_ => [this.dialogRef.disableClose = this.assetsForm.dirty || this.assetsForm.invalid]);
    }


    private pathForm(b: any) {
        this.cdr.markForCheck();
        this.assetsForm.patchValue({
            id: b.id,
            name: b.name,
            nameNepali: b.nameNepali,
            status: b.status,
        });
    }



    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.assetsForm, document.querySelector(`#res-message`));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }
        this.isWorking = true;

        this.assetsService.addOrUpdates(this.assetsForm.value)
            // this.assetsService.addOrUpdate(this.assetsForm.value)
            .pipe(takeUntil(this.toDestroy$),
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

                if (errors && errors.length > 0) {
                    this.errors = errors;
                    this.responseMessage = model.messageBody;
                }
            });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.assetsForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.assetsService.getAssetsById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }
        if (this.data.id > 0) {
            // this.assetsService.getAssetsById(this.data.id)
            this.assetsService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(500))
                .subscribe(r => {
                    const d: any = r;
                    this.pathForm(d);
                });
        }
    }

    cancel() {

        if (this.assetsForm.dirty) {
            this.dialog.open(ChangesConfirmComponent)
                .afterClosed().pipe(filter(_ => _))
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
