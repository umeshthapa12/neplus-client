import { ChangeDetectorRef, Component, ElementRef, Inject, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, delay, filter, map, startWith, takeUntil } from 'rxjs/operators';
import { ErrorCollection, ResponseModel, AsideNavModel } from '../../../../../models';
import { DropdownModel } from '../../../../../services';
import { fadeIn, fadeInOutStagger, FontIconsCssClass, GenericValidator, validateBeforeSubmit } from '../../../../../utils';
import { SiteNavService } from './site-navs.service';
import { ChangesConfirmComponent } from '../../../../shared';
import { DropdownStateSelector } from '../../../../../store/selectors';

@Component({
    templateUrl: './site-navs-form.component.html',
    animations: [fadeIn, fadeInOutStagger]
})
export class SiteNavFormComponent implements OnInit {
    private readonly toDestroy$ = new Subject<void>();
    navForm: FormGroup;
    displayMessage: any = {};

    private genericValidator: GenericValidator;
    @ViewChildren(FormControlName, { read: ElementRef })
    private formInputElements: ElementRef[];

    isError: boolean;
    responseMessage: string;
    errors: ErrorCollection[];
    isWorking: boolean;

    // name of the slice -> state.action
    @Select(DropdownStateSelector.SliceOf('SysModule')) module$: Observable<DropdownModel[]>;
    @Select(DropdownStateSelector.SliceOf('RouteTypes')) routeType$: Observable<DropdownModel[]>;
    @Select(DropdownStateSelector.SliceOf('AppAreas')) areaName$: Observable<DropdownModel[]>;

    parentNavs: DropdownModel[] = [];
    menuFor = 'parent';
    private readonly fontIcons: string[] = [];
    filteredFontIcons: Observable<string[]>;

    constructor(
        private cdr: ChangeDetectorRef,
        private uService: SiteNavService,
        private fb: FormBuilder,
        private dialogRef: MatDialogRef<SiteNavFormComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public data: AsideNavModel
    ) {
        this.genericValidator = new GenericValidator({
            type: {
                required: 'This field is required.',
            },
            module: {
                required: 'This field is required.',
            },
            area: {
                required: 'This field is required.',
            },
            text: {
                required: 'This field is required.',
            },
            pathSegment: {
                required: 'This field is required.',
            },
            parentId: {
                required: 'This field is required.',
            },
        });

        const icons = new FontIconsCssClass();

        this.fontIcons = [...icons.flaticons, ...icons.lineIcons];
    }

    ngOnInit() {
        this.initForm();

        this.filteredFontIcons = this.navForm.get('icon').valueChanges
            .pipe(
                startWith<string>(''),
                debounceTime(100),
                map(name => name ? this._filter(name) : this.fontIcons.slice())
            );
        if (this.data) {
            this.patchForm(this.data);
        }

    }

    private _filter(name: string): string[] {
        const filterValue = name.toLowerCase();

        return this.fontIcons.filter(icon => icon.toLowerCase().indexOf(filterValue) > -1);
    }

    ngAfterViewInit() {

        this.genericValidator
            .initValidationProcess(this.navForm, this.formInputElements)
            .subscribe(m => this.displayMessage = m);
        this.navForm.get('menuFor').valueChanges.pipe(
            debounceTime(200),
            takeUntil(this.toDestroy$),
        ).subscribe(value => {
            this.navForm.get('parentId').reset(null);
            this.menuForChange(value);
        });
    }

    private menuForChange(v: string) {

        this.menuFor = v;
        const isForChild = v !== 'parent';
        if (isForChild && this.parentNavs.length <= 0) {
            this.uService.getParents().pipe(
                takeUntil(this.toDestroy$)
            ).subscribe(_ => [this.cdr.markForCheck(), this.parentNavs = _.contentBody]);
        }

        const ctrl = this.navForm.get('parentId');

        ctrl.clearValidators();
        isForChild ? ctrl.setValidators(Validators.required) : ctrl.setValidators(null);

        ctrl.updateValueAndValidity();
    }

    hasPathChange(h: MatCheckboxChange) {
        const ctrl = this.navForm.get('pathSegment');

        ctrl.clearValidators();
        !h.checked ? ctrl.setValidators(null) : ctrl.setValidators(Validators.required);
        ctrl.setValue(null);
        ctrl.updateValueAndValidity();
    }

    saveChanges() {

        // this.cdr.markForCheck();
        this.clearErrors();

        // invalid form without filling required fields
        const errorMessage = validateBeforeSubmit(this.navForm, document.querySelector('#res-messages'));
        this.isError = errorMessage && errorMessage.length > 0;
        this.responseMessage = errorMessage;
        if (errorMessage) { return false; }

        this.isWorking = true;

        this.uService.addOrUpdate(this.navForm.value)
            .pipe(
                takeUntil(this.toDestroy$), delay(1500))
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
        if (this.navForm.dirty) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    private initForm() {

        this.cdr.markForCheck();

        this.navForm = this.fb.group({

            id: 0,
            parentId: null,
            type: [null, Validators.required],
            module: [null, Validators.required],
            area: [null, Validators.required],
            text: [null, Validators.required],
            icon: null,
            pathSegment: null,

            // internal use
            menuFor: 'parent'

        });

        this.navForm.valueChanges.pipe(
            takeUntil(this.toDestroy$),
        ).subscribe(_ => [this.dialogRef.disableClose = this.navForm.dirty || this.navForm.invalid]);
    }

    private patchForm(d: AsideNavModel) {

        this.cdr.markForCheck();
        const menuFor = d.parentId > 0 ? 'child' : 'parent';
        this.navForm.patchValue({
            id: d.id,
            parentId: d.parentId,
            type: d.type,
            module: d.module,
            area: d.area,
            text: d.text,
            icon: d.icon,
            pathSegment: d.pathSegment,
            menuFor
        });

        this.menuForChange(menuFor);
    }

}

