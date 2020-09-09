import { ChangeDetectorRef, Component, OnDestroy, Inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Subject } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { ErrorCollection, ResponseModel, Roles } from '../../../../../models';
import { fadeIn, formErrorMessage } from '../../../../../utils';
import { ChangesConfirmComponent } from '../../../../shared';
import { RoleService } from './roles.service';

@Component({
    templateUrl: './role-form.component.html',
    animations: [fadeIn]
})
export class RoleFormComponent implements OnDestroy {

    private readonly toDestroy$ = new Subject<void>();

    roleForm: FormGroup;

    isError: boolean;
    responseMessage: string;
    errors: ErrorCollection[];
    isWorking: boolean;

    displayMessage: any = {};

    constructor(
        private cdr: ChangeDetectorRef,
        private rService: RoleService,
        private dialog: MatDialog,
        private dialogRef: MatDialogRef<RoleFormComponent>,
        @Inject(MAT_DIALOG_DATA)
        public data: { role: Roles }) {

        this.roleForm = new FormGroup({
            id: new FormControl(0),
            name: new FormControl(null, Validators.required)
        });

        if (this.data && this.data.role && this.data.role.id > 0) {
            this.patchForm(this.data.role);
        }

    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    saveChanges() {
        this.cdr.markForCheck();
        this.clearErrors();

        // invalid form without filling required fields
        if (this.roleForm.invalid) {
            this.isError = true;
            this.responseMessage = formErrorMessage;
            return false;
        }

        this.isWorking = true;

        this.rService.addOrUpdateRole(this.roleForm.value)
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

    clearErrors() {
        this.cdr.markForCheck();
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }

    onCancel() {
        if (this.roleForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    private patchForm(d: Roles) {
        this.roleForm.patchValue({
            id: d.id,
            name: d.name
        });
    }
}
