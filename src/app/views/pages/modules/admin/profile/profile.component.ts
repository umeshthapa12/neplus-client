import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { Subject } from 'rxjs';
import { delay, switchMap, takeUntil } from 'rxjs/operators';
import { ResponseModel } from '../../../../../models';
import { ChangePasswordAction } from '../../../../../store/actions';
import { AppStateSelector } from '../../../../../store/selectors';
import { GenericValidator } from '../../../../../utils';
import { SnackToastService } from '../../../../shared';

@Component({
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnDestroy, AfterViewInit {

    private readonly toDestroy$ = new Subject<void>();

    adminForm: FormGroup;

    isWorking: boolean;

    displayMessage: any = {};
    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    constructor(
        private fb: FormBuilder,
        private store: Store,
        private notify: SnackToastService,
        private cdr: ChangeDetectorRef) {
        this.adminForm = this.fb.group({
            currentPassword: [null, [Validators.required, Validators.minLength(3)]],
            newPassword: [null, [Validators.required, Validators.minLength(6)]],
            cNewPassword: [null, [Validators.required, Validators.minLength(6)]],
        });

        this.genericValidator = new GenericValidator({
            currentPassword: {
                required: 'This field is required.',
                minlength: 'Must be greater than three characters long.'
            },
            newPassword: {
                required: 'This field is required.',
                minlength: 'Must be greater than six characters long.'
            },
            cNewPassword: {
                required: 'This field is required.',
                minlength: 'Must be greater than six characters long.',
                compare: 'Confirm password does not match.'
            }
        });
    }

    changePassword() {

        Object.keys(this.adminForm.value).forEach(key => this.adminForm.get(key).markAsDirty());
        this.adminForm.updateValueAndValidity();

        const isEqPq = this.adminForm.controls.newPassword.value === this.adminForm.controls.cNewPassword.value;
        if (!this.adminForm.valid || !isEqPq || !(this.adminForm.controls.currentPassword.value || '')) { return; }

        this.isWorking = true;

        this.store.dispatch(new ChangePasswordAction({
            currentPassword: this.adminForm.controls.currentPassword.value,
            newPassword: this.adminForm.controls.cNewPassword.value
        })).pipe(
            switchMap(_ => this.store.select(AppStateSelector.SliceOf('changePasswordSuccess'))),
            delay(800),
            takeUntil(this.toDestroy$),
        ).subscribe({
            next: (res: ResponseModel) => {
                this.cdr.markForCheck();
                console.log(res);
                this.notify.when('success', res, () => { this.isWorking = false; });
            },
            error: e => {
                this.cdr.markForCheck();
                this.notify.when('danger', e, () => { this.isWorking = false; });
            }
        });
    }

    ngAfterViewInit() {
        this.genericValidator
            .initValidationProcess(this.adminForm, this.formInputElements)
            .subscribe({ next: m => this.displayMessage = m });
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
