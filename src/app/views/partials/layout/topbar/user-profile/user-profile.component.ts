import { Component, Input, OnInit } from '@angular/core';
import { Store } from '@ngxs/store';
import { Observable, of } from 'rxjs';
import { LogoutAction } from '../../../../../store/actions';
import { Router } from '@angular/router';
import { AppStateSelector } from '../../../../../store/selectors';
import { switchMap, filter, debounceTime } from 'rxjs/operators';
import { ResponseModel } from '../../../../../models';

@Component({
    selector: 'kt-user-profile',
    templateUrl: './user-profile.component.html',
})
export class UserProfileComponent implements OnInit {
    isLoading = false;

    user$: Observable<any>;

    @Input() avatar = true;
    @Input() greeting = true;
    @Input() badge: boolean;
    @Input() icon: boolean;

    constructor(private store: Store, private router: Router) { }

    ngOnInit(): void {
        // this.user$ = this.store.pipe(select(currentUser));
        const u = {
            fullname: 'admin',
            id: 0,
            pic: './assets/media/users/default.jpg'
        };
        this.user$ = of(u);
    }

    logout() {
        if (this.isLoading) { return; }

        this.isLoading = true;

        this.store.dispatch(new LogoutAction()).pipe(
            switchMap(_ => this.store.select(AppStateSelector.SliceOf('logoutSuccess'))),
            filter((res: ResponseModel) => res && res.contentBody?.success),
            debounceTime(1000)
        ).subscribe({
            next: _ => [this.isLoading = false, this.router.navigateByUrl('/auth/login')],
            error: _ => [this.isLoading = false, this.router.navigateByUrl('/auth/login')]
        });
    }
}
