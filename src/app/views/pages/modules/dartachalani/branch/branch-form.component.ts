import { Component, OnInit, OnDestroy, ViewChildren, ElementRef, AfterViewInit, ChangeDetectorRef, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControlName } from '@angular/forms';
import { Subject } from 'rxjs';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { takeUntil, filter, delay } from 'rxjs/operators';
import { BranchService } from './branch.service';
import { fadeIn, GenericValidator } from '../../../../../../../src/app/utils';
import { ChangesConfirmComponent } from '../../../../../../../src/app/views/shared';

@Component({
    templateUrl: './branch-form.component.html',
    styleUrls: ['./branch.scss'],
    animations: [fadeIn],

})
export class BranchFormComponent implements OnInit, AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    bForm: FormGroup;
    isWorking: boolean;

    isError: boolean;
    responseMessage: string;
    errors: any[];

    displayMessage: any = {};
    genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<BranchFormComponent>,
        private bService: BranchService,
        @Inject(MAT_DIALOG_DATA)
        public data: any
    ) {
        this.genericValidator = new GenericValidator({
            'name': {
                'required': 'कार्यालयको शाखा अनिवार्य राख्नुहोस्'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    private initForm() {
        this.bForm = this.fb.group({
            id: 0,
            name: [null, Validators.required]
        });

        this.bForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.bForm.dirty || this.bForm.invalid]);
    }

    private patchForm(d: any) {
        this.cdr.markForCheck();

        this.bForm.patchValue({
            id: d.id,
            name: d.name
        });
    }

    save() {
        this.cdr.markForCheck();
        this.bService.add(this.bForm.value);
        this.dialogRef.close();
    }

    cancel() {
        if (this.bForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed().pipe(
                takeUntil(this.toDestroy$),
                filter(_ => _)
            ).subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    ngAfterViewInit() {
        this.validation();

        if (this.data.id > 0) {
            this.bService.getListById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(500)
            ).subscribe(r => {
                let d: any = r;
                this.patchForm(d);
            });
        }

        // Real Data
        // if (this.data.id > 0) {
        //     this.fyService.getFiscalYearById(this.data.id).pipe(
        //         takeUntil(this.toDestroy$),
        //         delay(500)
        //     ).subscribe(r => {
        //         let d: any = r;
        //         this.patchForm(d);
        //     });
        // }
    }

    private validation() {
        this.genericValidator
            .initValidationProcess(this.bForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }
}
