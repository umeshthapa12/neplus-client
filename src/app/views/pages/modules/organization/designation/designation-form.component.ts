import { takeUntil, delay, filter, startWith, map } from 'rxjs/operators';
import { Subject, Observable } from 'rxjs';
import { FormGroup, FormBuilder, Validators, FormControlName, FormControl } from '@angular/forms';
import { Component, OnInit, ChangeDetectorRef, Inject, OnDestroy, AfterViewInit, ViewChildren, ElementRef } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ResponseModel, ErrorCollection } from './../../../../../models';
import { GenericValidator, validateBeforeSubmit } from './../../../../../utils';
import { ChangesConfirmComponent } from './../../../../shared';
import { DesignationService } from './designation.service';

@Component({
    templateUrl: './designation-form.component.html',
    styleUrls: ['./designation.component.scss']
})
export class DesignationFormComponent implements OnInit, OnDestroy, AfterViewInit {
    private readonly toDestroy$ = new Subject<void>();
    designationForm: FormGroup;
    isWorking: boolean;
    displayMessage: any = {};
    isError: boolean;
    private genericValidator: GenericValidator;
    errors: any[];
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];
    filteredOptions: Observable<string[]>;
    myControl = new FormControl();

    constructor(private cdr: ChangeDetectorRef,
                private dialog: MatDialog,
                private fb: FormBuilder,
                private dialogRef: MatDialogRef<DesignationFormComponent>,
                private designationService: DesignationService,
                @Inject(MAT_DIALOG_DATA)
                public data: any,
    ) {
        this.genericValidator = new GenericValidator({
            name: {
                required: 'This is the Required Field'
            }
        });
    }

    designations = [
        { key: 1, value: 'Top' },
        { key: 2, value: 'Middle' },
        { key: 3, value: 'Low Lavel' },
    ];
    status = [
        { key: 1, value: 'Active' },
        { key: 2, value: 'Inactive' },
        { key: 3, value: 'Approve' },
        { key: 4, value: 'Pending' }
    ];

    options: string[] = ['one', 'Two', 'Three', 'Four', 'Five', 'Fifteen', 'Fourty', 'Only', 'Onetwo','seven'];
    states: string[] = [
        'Gandaki', 'Karnali', 'Bagmati', 'Sudurpachhim'
    ];

    // Initially fill the selectedStates so it can be used in the for loop** //
selectedStates = this.states;
onKey(value) {
    this.selectedStates = this.search(value);
    }
    search(value: string) {
        let filter = value.toLowerCase();
        return this.states.filter(option => option.toLowerCase().startsWith(filter));
      }

    ngOnInit() {
        this.initForm();
        this.autoComplite();
    }

    initForm() {
        this.designationForm = this.fb.group({
            id: 0,
            name: [null, Validators.required],
            nameNepali: null,
            designationLevel: null,
            designationSalary: null,
            gradeRate: null,
            status: 'Active',
        });
        this.designationForm.valueChanges.pipe(
            takeUntil(this.toDestroy$)
        ).subscribe(_ => [this.dialogRef.disableClose = this.designationForm.dirty || this.designationForm.invalid]);
    }

 autoComplite() {
     this.filteredOptions = this.myControl.valueChanges
     .pipe(
         startWith(''),
         map(value => this._filter(value))
     );


 }

 private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().includes(filterValue));
  }


    patchForm(d: any) {
        this.designationForm.patchValue({
            id: d.id,
            name: d.name,
            nameNepali: d.nameNepali,
            designationLevel: d.designationLevel,
            designationSalary: d.designationSalary,
            gradeRate: d.gradeRate,
            status: d.status
        });

    }
    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.designationForm);
        if (errorMessage) { return false; }
        this.isWorking = true;
        this.designationService.addOrUpdate(this.designationForm.value)
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
            .initValidationProcess(this.designationForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
        if (this.data.id > 0) {
            this.designationService.getListById(this.data.id)
                .pipe(takeUntil(this.toDestroy$), delay(500))
                .subscribe(r => {
                    this.cdr.markForCheck();
                    const d: any = r;
                    this.patchForm(d);
                });
        }
    }
    cancel() {
        if (this.designationForm.dirty) {
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
