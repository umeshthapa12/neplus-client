import { ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChildren } from '@angular/core';
import { FormArray, FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { delay, filter, takeUntil, tap } from 'rxjs/operators';
import { DropdownStateSelector } from '../../../../../store/selectors';
import { Companies, ErrorCollection, PhoneNumberModel, ResponseModel, UserAccount } from '../../../../../models';
import { DropdownModel } from '../../../../../services';
import { fadeIn, GenericValidator, Regex, validateBeforeSubmit } from '../../../../../utils';
import { ChangesConfirmComponent, SnackToastService } from '../../../../shared';
import { UpdateIfCachedAction, UserAddOrUpdateAction } from './store/users.store';
import { UserService } from './user-account.service';
import { UserMainComponent } from './user-main.component';

@Component({
    selector: 'user-info',
    templateUrl: './user-form.component.html',
    animations: [fadeIn],
    styles: [`
        .mat-dialog-content{
            margin: 0px !important;
            padding:0px;
        }
    `]
})
export class UserFormComponent implements OnInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    userForm: FormGroup;
    displayMessage: any = {};

    hideNew = true;
    hideConfirm = true;

    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    isError: boolean;
    responseMessage: string;
    errors: ErrorCollection[];
    isWorking: boolean;

    phoneType = ['Mobile', 'Office', 'Home'];

    // name of the slice -> state.action
    @Select(DropdownStateSelector.SliceOf('SystemRoles')) roles$: Observable<DropdownModel[]>;
    @Select('users_add_update', 'payload')
    userPayload$: Observable<ResponseModel>;


    constructor(
        private cdr: ChangeDetectorRef,
        private uService: UserService,
        private fb: FormBuilder,
        private store: Store,
        private nodify: SnackToastService,
        private dialogRef: MatDialogRef<UserMainComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: { id: number }
    ) {
        this.genericValidator = new GenericValidator({
            username: {
                required: 'This field is required.',
                minlength: 'Must be between six and 20 characters long',
                maxlenght: 'Must be between six and 20 characters long',
                conflict: 'Already taken. Try another',
                pattern: 'Contains whitespace'
            },
            password: {
                required: 'This field is required.'
            },
            cPassword: {
                required: 'This field is required.',
                compare: 'Confirm password does not match'
            },
            fName: {
                required: 'This field is required.'
            },
            lName: {
                required: 'This field is required.'
            },
            roleId: {
                required: 'This field is required.'
            },
            dateOfBirth: {
                required: 'This field is required.'
            },
            address: {
                required: 'This field is required.'
            },
            email: {
                pattern: 'Email address is not valid.'
            }
        });
    }

    ngOnInit() {
        this.initForm();
    }

    ngAfterViewInit() {

        this.genericValidator
            .initValidationProcess(this.userForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });

        if (this.data.id > 0) {
            this.uService.getUserById(this.data.id).pipe(
                takeUntil(this.toDestroy$),
                delay(800)
            ).subscribe(res => {
                const d: Companies = res.contentBody;
                this.patchForm(d);
            });
        }

        this.formSubmittedResponse();
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    private formSubmittedResponse() {

        this.userPayload$.pipe(
            filter(_ => _ && _.contentBody),
            takeUntil(this.toDestroy$),
            // since we've cached display data to reduce server round trip, should get updated accordingly
            tap(res => this.store.dispatch(new UpdateIfCachedAction(res.contentBody))),
        ).subscribe({
            next: res => [this.isWorking = false, this.nodify.when('success', res, () => this.clearErrors)],
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

    contactControls(): FormArray {
        return  this.userForm.get('phoneNumbers') as FormArray;
    }

    contactNumberAction(index: number) {
        const controls = this.contactControls();
        if (index > -1) {
            controls.removeAt(index);
        } else {
            controls.push(this.createItem());
            setTimeout(() => {
                document.getElementById('contact-phone-wrap').scrollIntoView({ behavior: 'smooth', block: 'end', inline: 'end' });
            }, 100);
        }
    }

    saveChanges() {

        this.clearErrors();

        // invalid form without filling required fields
        const errorMessage = validateBeforeSubmit(this.userForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;
        this.store.dispatch(new UserAddOrUpdateAction(this.userForm.value));

    }

    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    onCancel() {
        if (this.userForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    private createItem(model?: PhoneNumberModel): FormGroup {
        return this.fb.group({
            phoneType: (model && model.phoneType || 'Office'),
            number: [(model && model.number), [Validators.required, Validators.maxLength(15)]],
        });
    }

    private initForm() {
        this.cdr.markForCheck();
        const usernamevalidators = [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(20),
            Validators.pattern(/^[^\s]+$/)
        ];

        this.userForm = this.fb.group({

            id: 0,
            accountId: 0,
            guid: null,
            // account info
            username: [null, Validators.compose(usernamevalidators), this.uService.userValidator()],
            password: [null, Validators.required],
            cPassword: [null, Validators.required],
            roleId: [null, Validators.required],

            // profile info
            fName: [null, Validators.required],
            mName: null,
            lName: [null, Validators.required],
            address: [null, Validators.required],
            dateOfBirth: [null, Validators.required],
            email: [null, Validators.pattern(Regex.emailRegex)],
            gender: null,
            phoneNumbers: this.fb.array([this.createItem()]),

        });

        this.userForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.userForm.dirty || this.userForm.invalid]);
    }

    private patchForm(d: UserAccount) {

        this.cdr.markForCheck();

        const controls = this.contactControls();

        if (d.phoneNumbers && d.phoneNumbers.length > 0) {
            // clear all controls if we have some response data
            controls.controls = [];
            d.phoneNumbers.forEach(p => controls.push(this.createItem(p)));
        }

        controls.updateValueAndValidity();

        this.userForm.patchValue({
            id: d.id,
            accountId: d.accountId,
            guid: d.guid,
            // account info
            username: d.username,
            password: d.password,
            cPassword: d.password,
            roleId: d.roleId,

            // profile info
            fName: d.fName,
            mName: d.mName,
            lName: d.lName,
            address: d.address,
            dateOfBirth: d.dateOfBirth,
            email: d.email,
            gender: d.gender,

        });

        this.userForm.updateValueAndValidity();
    }
}
