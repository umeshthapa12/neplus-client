import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChildren, ViewChild } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { debounceTime, delay, filter, takeUntil } from 'rxjs/operators';
import { ErrorCollection, MailServer, ResponseModel } from '../../../../../models';
import { fadeIn, GenericValidator, validateBeforeSubmit, ExtendedMatDialog } from '../../../../../utils';
import { MailServerService } from './mail-server.service';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { ChangesConfirmComponent } from '../../../../shared';

@Component({
    templateUrl: './mail-server-form.component.html',
    animations: [fadeIn],
    styles: [`
        .btn-test-connection__wrap{
            padding-bottom: 18px;
        }

    `]
})
export class MailServerFormComponent implements OnInit, AfterViewInit {

    private readonly toDestroy$ = new Subject<void>();
    msForm: FormGroup;
    displayMessage: any = {};

    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    isError: boolean;
    responseMessage: string;
    errors: ErrorCollection[];
    isWorking: boolean;
    isTestinfCon: boolean;

    // the created mail server is either for a company or for an admin itself.
    // Give user to select a company or if it's not selected, admin guid will be added by default
    employers = this.mService.getEmployers();

    accountInfo = 'Adds user reference to this mail server setting. Either selected account or you\'ll be added as a ref. if not selected.';

    @ViewChild(CdkDrag, { static: true })
    private readonly drag: CdkDrag;

    constructor(
        private cdr: ChangeDetectorRef,
        private fb: FormBuilder,
        private mService: MailServerService,
        private exDialog: ExtendedMatDialog,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<MailServerFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number, guid: string }
    ) {
        this.genericValidator = new GenericValidator({
            title: {
                required: 'This field is required.',
            },
            host: {
                required: 'This field is required.',
            },
            port: {
                required: 'This field is required.',
                pattern: 'Numbers only: e.g. 587'
            },
            username: {
                required: 'This field is required.',
            },
            password: {
                required: 'This field is required.',
            },
            confirmPassword: {
                required: 'This field is required.',
                compare: 'Confirm password does not match.',
            },
            employerId: {
                required: 'This field is required.',
            },
        });


    }

    ngOnInit() {

        this.initForm();

        this.getEditableData();
    }

    /** Gets and patch editable data  by ID nad user GUID from the API */
    private getEditableData() {

        if (!(this.data && this.data.id > 0 && this.data.guid)) { return; }

        this.mService.getMailServerById(this.data.id, this.data.guid).pipe(
            delay(200),
            takeUntil(this.toDestroy$)
        ).subscribe({
            next: res => this.patchForm(res.contentBody)
        });
    }

    ngAfterViewInit() {

        this.genericValidator
            .initValidationProcess(this.msForm, this.formInputElements)
            .subscribe({ next: m => [this.cdr.markForCheck(), this.displayMessage = m] });

        // whether to add or remove validations
        this.msForm.get('requiresAuthentication').valueChanges.pipe(
            // this line of code gets tricky here.
            // Since we are capturing change events to re-validate or update UI, we need to be careful with this approach
            filter(_ => this.msForm.dirty && !this.msForm.pristine && this.msForm.touched),
            debounceTime(800),
            takeUntil(this.toDestroy$)
        ).subscribe({
            next: this.validateAccountCred
        });

        this.fieldValueCompararValidation();

        // makes transparent when dialog drag and move
        this.exDialog.makeTransparentWhenDragMmove(this.drag);
    }

    testConnection() {

        this.clearErrors();
        this.isTestinfCon = true;
        this.mService.testConnection(this.msForm.value).pipe(
            takeUntil(this.toDestroy$),
            delay(800)
        ).subscribe({
            next: _ => {
                this.isTestinfCon = null;
                this.responseMessage = _.messageBody;
            },
            error: (e: ResponseModel) => {

                this.isError = true;
                this.isTestinfCon = null;
                this.responseMessage = e && e.error.messageBody;
            }
        });
    }

    saveChanges() {

        this.clearErrors();

        // invalid form without filling required fields
        const errorMessage = validateBeforeSubmit(this.msForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;

        const body: MailServer = this.msForm.value;

        // if the user did not checked to requires authentication box, remove username & pw
        if (!body.requiresAuthentication) {
            delete body.username;
            delete body.password;
        }

        this.mService.addOrUpdateMailServer(this.msForm.value)
            .pipe(
                takeUntil(this.toDestroy$), delay(1500))
            .subscribe({
                next: res => {
                    this.dialogRef.close(res);
                    this.isWorking = false;
                },
                error: _ => this.exceptions(_)
            });
    }

    /** Resets error state values */
    clearErrors() {
        this.cdr.markForCheck();
        this.isTestinfCon = null;
        this.isError = null;
        this.responseMessage = null;
        this.errors = null;
    }

    onCancel() {
        if (this.msForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    /** Adds and removes validations based on requires authentication checkbox value */
    private validateAccountCred = (isRequired: boolean) => {

        const uCtrl = this.msForm.get('username');
        const p1Ctrl = this.msForm.get('password');
        const p2Ctrl = this.msForm.get('confirmPassword');

        if (isRequired) {
            uCtrl.setValidators(Validators.required);
            p1Ctrl.setValidators(Validators.required);
            p2Ctrl.setValidators(Validators.required);


        } else {
            uCtrl.setValidators(null);
            p1Ctrl.setValidators(null);
            p2Ctrl.setValidators(null);
        }

        uCtrl.updateValueAndValidity();
        p1Ctrl.updateValueAndValidity();
        p2Ctrl.updateValueAndValidity();
    }

    /** Compares password & confirm password values */
    private fieldValueCompararValidation() {
        const p2Ctrl = this.msForm.get('confirmPassword');
        p2Ctrl.valueChanges.pipe(debounceTime(800), takeUntil(this.toDestroy$), filter(v => v)).subscribe({
            next: value => {
                const p1Ctrl = this.msForm.get('password');
                if (value !== p1Ctrl.value) {
                    p2Ctrl.setErrors({ compare: true });
                } else {
                    p2Ctrl.setErrors(null);
                }
            }
        });
    }

    private initForm() {

        this.cdr.markForCheck();

        this.msForm = this.fb.group({

            id: 0,
            userGuid: null,
            title: [null, Validators.required],
            host: [null, Validators.required],
            port: [null, [Validators.required, Validators.pattern(/^[0-9]*$/)]],
            isDefault: false,
            requiresAuthentication: [!(this.data && this.data.id > 0), Validators.required],
            username: null,
            password: null,
            confirmPassword: null,
            description: null
        });

        this.msForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.msForm.dirty || this.msForm.invalid]);
    }

    private patchForm(d: MailServer) {

        this.msForm.patchValue({
            id: d.id,
            userGuid: d.userGuid,
            title: d.title,
            host: d.host,
            port: d.port,
            isDefault: d.isDefault,
            requiresAuthentication: d.requiresAuthentication,
            username: d.username,
            password: d.password,
            confirmPassword: d.password,
            description: d.description
        });
    }

    private exceptions = (e: ResponseModel) => {
        this.cdr.markForCheck();
        this.isError = true;
        this.isWorking = false;
        const model: ResponseModel = e.error;
        const errors: ErrorCollection[] = model.contentBody.errors;

        // Check if server returning number of error list, if so make these as string
        if (errors && errors.length > 0) {
            this.errors = errors;
            this.responseMessage = model.messageBody;
        } else {
            this.responseMessage = e.messageBody;
        }
    }

}
