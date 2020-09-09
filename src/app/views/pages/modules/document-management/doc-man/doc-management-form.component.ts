import {
    Component, OnInit, AfterViewInit, OnDestroy, ViewChildren, ElementRef, ChangeDetectorRef, Inject
} from '@angular/core';
import { FormGroup, FormControlName, FormBuilder } from '@angular/forms';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { takeUntil, delay, filter } from 'rxjs/operators';
import { fadeIn, fadeInOutStagger, GenericValidator, validateBeforeSubmit } from '../../../../../../../src/app/utils';
import { ErrorCollection, ResponseModel } from '../../../../../../../src/app/models';
import { DocumentManagementService } from './doc-management.service';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';

@Component({
    selector: 'app-name',
    templateUrl: './doc-management-form.component.html',
    animations: [fadeIn, fadeInOutStagger],
    styleUrls: ['./doc-management.scss']
})
export class DocumentManagementFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    docManagementForm: FormGroup;

    responseMessage: string;
    isError: boolean;
    errors: ErrorCollection[];
    isWorking: boolean;

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    fiscalYears: any[] = [
        { key: 1, value: '2076/77' },
        { key: 2, value: '2077/78' },
        { key: 3, value: '2078/79' },
        { key: 4, value: '2079/80' },
    ];

    categories: any[] = [
        { key: 1, value: 'Category 1' },
        { key: 2, value: 'Category 2' },
        { key: 3, value: 'Category 3' },
        { key: 4, value: 'Category 4' },
    ];

    files: any[] = [];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<DocumentManagementFormComponent>,
        private docManagementService: DocumentManagementService,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
        });
    }

    onSelectFile(event) {
        for (let index = 0; index < event.length; index++) {
            const element = event[index];
            this.files.push(element.name);
        }
        console.log(event);
    }

    removeAll() {
        this.files = [];

    }
    uplaodAll() {

    }

    removeSingleFile(i) {
        this.files.splice(i, 1);
    }

    uplaodSingleFile() {
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.docManagementForm = this.fb.group({
            id: 0,
            title: null,
            fiscalYear: null,
            description: null,
            date: '2020',
            category: null
        });
        /** If form is dirty or invalid then backdrop click close disable and animate dialog. */
        this.docManagementForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.docManagementForm.dirty || this.docManagementForm.invalid]);
    }

    private patchForm(d: any) {
        this.docManagementForm.patchValue({
            id: d.id,
            title: d.title,
            fiscalYear: d.fiscalYear,
            description: d.description,
            date: d.date,
            category: d.category
        });
        this.categories = d.category;
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.docManagementForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        this.isWorking = true;

        if (this.data.id > 0) {
            this.docManagementService.update(this.docManagementForm.value)
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
        } else {
            this.docManagementService.add(this.docManagementForm.value)
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
        if (this.docManagementForm.dirty) {
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
            .initValidationProcess(this.docManagementForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        /** Gets and patch editable data  by ID from the API */
        // if (this.data.id > 0) {
        //     this.docManagementService.getListById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }

        if (this.data.id > 0) {
            this.docManagementService.getListById(this.data.id).pipe(
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
