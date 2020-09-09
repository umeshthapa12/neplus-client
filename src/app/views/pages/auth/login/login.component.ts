import { ChangeDetectorRef, Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../../../../environments/environment';
import { ResponseModel, UsersModel } from '../../../../models';
import { SessionExpiredAction, UserLoginAction } from '../../../../store/actions';
import { AppStateSelector } from '../../../../store/selectors';
import { faeInOut } from '../../../../utils';

@Component({
    selector: 'kt-login',
    templateUrl: './login.component.html',
    encapsulation: ViewEncapsulation.None,
    animations: [faeInOut]
})
export class LoginComponent implements OnInit, OnDestroy {

    private readonly unsubscribe = new Subject<void>();
    private returnUrl: string;

    @Select(AppStateSelector.SliceOf('isSessionExpired'))
    isExpired$: Observable<boolean>;
    loginForm: FormGroup;
    loading: boolean;
    response: ResponseModel;
    isError: boolean;
    captchaMath: { x: number, y: number };

    constructor(
        private router: Router,
        private fb: FormBuilder,
        private cdr: ChangeDetectorRef,
        private route: ActivatedRoute,
        private store: Store
    ) { }

    ngOnInit(): void {
        this.initLoginForm();

        // redirect back to the returnUrl before login
        this.route.queryParams.subscribe(params => {
            this.returnUrl = params.returnUrl || '/';
        });
    }

    ngOnDestroy(): void {
        this.unsubscribe.next();
        this.unsubscribe.complete();
    }

    initLoginForm() {

        this.loginForm = this.fb.group({
            email: [environment.user.username, Validators.compose([
                Validators.required,
                // Validators.email,
                Validators.minLength(3),
                // Validators.maxLength(320) // https://stackoverflow.com/questions/386294/what-is-the-maximum-length-of-a-valid-email-address
            ])
            ],
            password: [environment.user.password, Validators.compose([
                Validators.required,
                Validators.minLength(3),
                Validators.maxLength(100)
            ])
            ],
            captchaValue: null
        });
    }

    submit() {
        this.cdr.markForCheck();
        this.response = null;
        this.isError = false;

        const controls = this.loginForm.controls;
        /** check form */
        if (this.loginForm.invalid) {
            Object.keys(controls).forEach(controlName =>
                controls[controlName].markAsTouched()
            );
            return;
        }

        this.loading = true;

        const payload: UsersModel = {
            username: controls.email.value,
            // we send bytes[] to the endpoint so backend will parse and validate it.
            passwordArray: toUTF8Array(controls.password.value),
            captchaValue: +controls.captchaValue.value
        };
        this.captchaMath = null;
        this.store.dispatch(new UserLoginAction(payload)).pipe(
            startWith(this.store.dispatch(new SessionExpiredAction(false))),
            switchMap(_ => this.store.select(AppStateSelector.SliceOf('loginSuccess'))),
            filter(res => !!res),
            debounceTime(800),
            tap((res: ResponseModel) => [this.cdr.markForCheck(), this.response = res, this.loading = false]),
            debounceTime(800),
            takeUntil(this.unsubscribe),
        ).subscribe({
            next: res => {
                this.cdr.markForCheck();
                if (res.contentBody) {
                    this.router.navigateByUrl(this.returnUrl);
                }
                this.loading = false;
            },
            error: (e: ResponseModel) => {
                this.cdr.markForCheck();
                this.loading = false;
                this.isError = true;
                this.response = e;
                this.captchaMath = e.error.contentBody;
                controls.captchaValue.reset();
            }
        });
    }

    /**
     * Checking control validation
     *
     * @param controlName: string => Equals to formControlName
     * @param validationType: string => Equals to validators name
     */
    isControlHasError(controlName: string, validationType: string): boolean {
        const control = this.loginForm.controls[controlName];
        if (!control) {
            return false;
        }

        const result = control.hasError(validationType) && (control.dirty || control.touched);
        return result;
    }
}

/**
 * @link https://stackoverflow.com/a/18729931/4444844
 * @param str input string to convert byte array
 */
function toUTF8Array(str: string) {
    const utf8: number[] = [];
    for (let i = 0; i < str.length; i++) {
        let charcode = str.charCodeAt(i);
        if (charcode < 0x80) { utf8.push(charcode); } else if (charcode < 0x800) {
            utf8.push(0xc0 | (charcode >> 6),
                0x80 | (charcode & 0x3f));
        } else if (charcode < 0xd800 || charcode >= 0xe000) {
            utf8.push(0xe0 | (charcode >> 12),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        } else {
            i++;
            // UTF-16 encodes 0x10000-0x10FFFF by
            // subtracting 0x10000 and splitting the
            // 20 bits of 0x0-0xFFFFF into two halves
            charcode = 0x10000 + (((charcode & 0x3ff) << 10)
                | (str.charCodeAt(i) & 0x3ff));
            utf8.push(0xf0 | (charcode >> 18),
                0x80 | ((charcode >> 12) & 0x3f),
                0x80 | ((charcode >> 6) & 0x3f),
                0x80 | (charcode & 0x3f));
        }
    }
    return utf8;
}
