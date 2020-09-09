import {
    Component, OnInit, OnDestroy, ElementRef, AfterViewInit, AfterContentChecked, ChangeDetectorRef, ViewChildren, ViewChild
} from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil, filter } from 'rxjs/operators';
import { FormBuilder, FormGroup, FormControlName } from '@angular/forms';
import Quill from 'quill';
import {
    fadeIn, fadeInOutStagger, GenericValidator, QuilljsService, validateBeforeSubmit
} from '../../../../../../../../src/app/utils';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

import { ChangesConfirmComponent } from '../../../../../../../../src/app/views/shared';
import { BerujuAuditService } from './beruju-audit.service';

@Component({
    templateUrl: './letter-preview.component.html',
    animations: [fadeIn, fadeInOutStagger]
})
export class LetterPreviewComponent implements OnInit, AfterViewInit, AfterContentChecked, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();

    isWorking: boolean;
    displayMessage: any = {};

    quill$: Quill;
    @ViewChild('auditBody', { read: ElementRef, })
    private bodyEl: ElementRef;

    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];
    genericValidator: GenericValidator;

    lpForm: FormGroup;
    titles: any[] = [];
    titleValue: any;
    list: any[] = [];
    letter: any;

    isError: boolean;
    responseMessage: string;
    errors: any[];

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<LetterPreviewComponent>,
        private tService: BerujuAuditService,
        private quilljsService: QuilljsService
    ) {
        this.genericValidator = new GenericValidator({
            title: {
                required: 'This field is required.'
            },
            subject: {
                required: 'This field is required.'
            }
        });
    }

    ngOnInit() {
        this.initForms();
        this.getTitles();
    }

    private initForms() {
        this.lpForm = this.fb.group({
            id: 0,
            title: null,
            subject: null,
            body: null,
            letterNo: null,
            address: null,
            address1: null,
            date: null,
            heading: null,
            companyAddress: null,
            sender: null,
        });

        this.lpForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.lpForm.dirty || this.lpForm.invalid]);
    }

    saveChanges() {
        const errorMessage = validateBeforeSubmit(this.lpForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;
    }

    cancel() {
        if (this.lpForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed().pipe(
                takeUntil(this.toDestroy$),
                filter(_ => _)
            ).subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    ngAfterViewInit() {
        this.quill$ = this.quilljsService
            .initQuill(this.bodyEl)
            .textChangeValueSetter(this.lpForm.get('body'), 'html')
            .getQuillInstance();

        this.genericValidator
            .initValidationProcess(this.lpForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        this.detectChanges();
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    private patchForm(data: any) {
        this.lpForm.patchValue({
            id: data.id,
            title: data.title,
            subject: data.subject,
            body: data.body,
            letterNo: data.letterNo,
            address: data.address,
            address1: data.address1,
            date: data.date,
            heading: data.heading,
            companyAddress: data.companyAddress,
            sender: data.sender,
        });
    }

    ngAfterContentChecked() {
        if (this.titleValue !== undefined && this.titleValue !== null) {
            this.tService.getListByTitle(this.titleValue).pipe(takeUntil(this.toDestroy$)).subscribe({
                next: res => {
                    this.patchForm(res);
                    this.quill$.root.innerHTML = res.body;
                    this.letter = res;
                }
            });
            this.lpForm.valueChanges.subscribe(_ => this.letter = _);
            this.titleValue = undefined;
        }
    }

    getList() {
        this.tService.getList().pipe()
            .subscribe({
                next: res => {
                    this.list = res;
                }
            });
    }

    private detectChanges() {
        this.lpForm.get('title').valueChanges.subscribe({
            next: res => {
                this.titleValue = res;
            }
        });
    }

    getTitles() {
        this.tService.getList().pipe().subscribe({
            next: res => {
                this.titles = res;
            }
        });
    }
}
