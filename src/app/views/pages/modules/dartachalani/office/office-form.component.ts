import {
    Component, OnInit, OnDestroy, AfterViewInit, ViewChildren, ElementRef, Inject, ChangeDetectorRef
} from '@angular/core';
import { FormGroup, FormBuilder, FormControlName, Validators } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { fadeIn, fadeInOutStagger, GenericValidator, validateBeforeSubmit } from '../../../../../utils';
import { ErrorCollection, ResponseModel } from '../../../../../models';
import { ChangesConfirmComponent } from '../../../../shared';
import { OfficeService } from './office.service';


@Component({
    templateUrl: './office-form.component.html',
    animations: [fadeIn, fadeInOutStagger],
    styleUrls: ['./office.component.css']
})

export class OfficeFormComponent implements OnInit, AfterViewInit, OnDestroy {

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private officeService: OfficeService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<OfficeFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        /** Set the require message on required controls. */
        this.genericValidator = new GenericValidator({
            name: {
                required: ' Name must be required'
            },

        });
    }

    /**
     * Create a toDestroy$ property. Subject is like EventEmitters it maintain a registry of many listeners.
     */
    private readonly toDestroy$ = new Subject<void>();

    /**
     * ItemGroup FormGroup name
     */
    officeForm: FormGroup;

    /**
     * Create variables for displaying any error or success message.
     */
    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    /**
    /**
     * Created displayMessage property for displaying form validation messages.
     * Created genericValidator with type GenericValidator used for form validation in component and set validation message.
     */
    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    status: any[] = [
        { id: 1, value: 'Active' },
        { id: 2, value: 'Inactive' }
    ];

    ngOnInit() {
        this.initForm();

    }

    /** Construct form controls with form builder */
    private initForm() {
        this.officeForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            status: 'Active',

        });

        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.officeForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.officeForm.dirty || this.officeForm.invalid]);
    }

    private patchForm(i: any) {
        this.cdr.markForCheck();
        this.officeForm.patchValue({
            id: i.id,
            name: i.name,
            status: i.status,
        });

    }

    saveChanges() {
        // console.log(this.iForm.value);
        const errorMessage = validateBeforeSubmit(this.officeForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        this.isWorking = true;

        if (this.data.id > -1) {
             this.officeService.update(this.officeForm.value)
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
         } else {

            this.officeService.add(this.officeForm.value)
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
        if (this.officeForm.dirty) {
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
            .initValidationProcess(this.officeForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        /** Gets and patch editable data  by ID from the API */
        if (this.data.id > 0) {
            this.officeService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                 delay(500)
             ).subscribe(r => {
                 let d: any = r;
                 this.patchForm(d);
             });
         }

        // if (this.data.id > 0) {
        //      this.officeService.getListById(this.data.id).pipe(
        //          takeUntil(this.toDestroy$),
        //          delay(500)
        //      ).subscribe(r => {
        //          const d: any = r;
        //          this.patchForm(d);
        //      });
        //  }
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
