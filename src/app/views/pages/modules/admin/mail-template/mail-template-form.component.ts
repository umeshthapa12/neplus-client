import { CdkDrag } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Store } from '@ngxs/store';
import Quill from 'quill';
import { Subject } from 'rxjs';
import { delay, filter, takeUntil, tap, debounce, debounceTime } from 'rxjs/operators';
import { ErrorCollection, MailTemplate, ResponseModel } from '../../../../../models';
import { ExtendedMatDialog, fadeIn, GenericValidator, QuilljsService, validateBeforeSubmit } from '../../../../../utils';
import { ChangesConfirmComponent } from '../../../../shared';
import { MailTemplateService } from './mail-template.service';
import { UpdateIfCachedAction } from './store/mail-template.store';

@Component({
    templateUrl: './mail-template-form.component.html',
    animations: [fadeIn]
})
export class MailtemplateFormComponent implements OnInit, AfterViewInit {

    private readonly toDestroy$ = new Subject<void>();

    companyForm: FormGroup;
    displayMessage: any = {};

    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    isError: boolean;
    responseMessage: string;
    errors: ErrorCollection[];
    isWorking: boolean;
    quill$: Quill;
    @ViewChild('mailBody', { read: ElementRef, static: true })
    private bodyEl: ElementRef;

    @ViewChild(CdkDrag, { static: true })
    private readonly drag: CdkDrag;

    // the created mail server is either for a company or for an admin itself.
    // Give user to select a company or if it's not selected, admin guid will be added by default
    employers = this.mtService.getEmployers();

    // mail titles to select auto response body
    mailTitles = this.mtService.getDefaultMailTitles();

    accountInfo = '(Optional) Adds user reference to this mail template. Either selected account or you\'ll be added as a ref. if not selected.';
    titleInfo = 'This title might get validates and select its body to send an automatic response to the end user.';

    constructor(
        private cdr: ChangeDetectorRef,
        private store: Store,
        private mtService: MailTemplateService,
        private fb: FormBuilder,
        private quilljsService: QuilljsService,
        private exDialog: ExtendedMatDialog,
        private dialogRef: MatDialogRef<MailtemplateFormComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number, guid: string }
    ) {
        this.genericValidator = new GenericValidator({
            title: {
                required: 'This field is required.',
                conflict: 'Already exist. Try another',
            },
            subject: {
                required: 'This field is required.'
            },
            body: {
                required: 'This field is required.'
            },
        });
    }

    ngOnInit() {
        this.initForm();
    }

    ngAfterViewInit() {

        this.genericValidator
            .initValidationProcess(this.companyForm, this.formInputElements)
            .subscribe({ next: m => [this.cdr.markForCheck(), this.displayMessage = m] });

        this.quill$ = this.quilljsService
            .initQuill(this.bodyEl)
            .textChangeValueSetter(this.companyForm.get('body'), 'html')
            .getQuillInstance();

        this.initData();

        // makes transparent when dialog drag and move
        this.exDialog.makeTransparentWhenDragMmove(this.drag);

        const cuTitleCtrl = this.companyForm.get('title');

        this.companyForm.get('defaultTitle').valueChanges.pipe(
            takeUntil(this.toDestroy$)
        ).subscribe({
            next: value => {

                value === 'other'
                    ? [
                        cuTitleCtrl.setValidators(Validators.required),
                        cuTitleCtrl.setAsyncValidators(this.mtService.titleValidator())
                    ]
                    : [cuTitleCtrl.clearValidators(), cuTitleCtrl.clearAsyncValidators()];

                cuTitleCtrl.updateValueAndValidity();
            }
        });

    }


    private initData() {

        if (this.data.id <= 0) { return; }

        this.mtService.getTemplate(this.data.id, this.data.guid).pipe(
            takeUntil(this.toDestroy$),
            delay(800)
        ).subscribe(res => {

            const d: MailTemplate = res.contentBody;

            this.patchForm(d);
            if (!d.body) { return; }

            this.quill$.root.innerHTML = d.body;

        });

    }

    isOtherTitle = () => { this.cdr.markForCheck(); return this.companyForm.get('defaultTitle').value === 'other'; };

    saveChanges() {

        this.cdr.markForCheck();
        this.clearErrors();

        // invalid form without filling required fields
        const errorMessage = validateBeforeSubmit(this.companyForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;

        this.mtService.addOrUpdateTemplate(this.companyForm.value)
            .pipe(
                takeUntil(this.toDestroy$),
                delay(1500),
                // since we've cached display data to reduce server round trip, should get updated accordingly
                tap(res => this.store.dispatch(new UpdateIfCachedAction(res.contentBody))),
            ).subscribe({
                next: res => {
                    this.dialogRef.close(res);
                    this.isWorking = false;
                },
                error: e => {
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
                }
            });
    }

    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    onCancel() {
        if (this.companyForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    private initForm() {

        this.companyForm = this.fb.group({

            id: 0,
            userGuid: null,
            defaultTitle: 'other',
            title: null,
            subject: [null, Validators.required],
            body: [null, Validators.required],
            description: null,
        });

        this.companyForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = (this.companyForm.dirty || this.companyForm.invalid)]);
    }

    private patchForm(d: MailTemplate) {

        this.companyForm.patchValue({
            id: d.id,
            userGuid: d.userGuid,
            title: d.title,
            defaultTitle: d.defaultTitle,
            subject: d.subject,
            body: d.body,
            description: d.description,
        });

        const ctrl = this.companyForm.get('defaultTitle');
        this.data.id > 0 && !this.isOtherTitle()
            ? ctrl.disable()
            : ctrl.enable();

    }
}
