// Angular
import { Component, Input, OnInit } from '@angular/core';
// RxJS
import { Observable, of } from 'rxjs';
// NGRX
import { select, Store } from '@ngrx/store';
// State
// import { AppState } from '../../../../../core/reducers';
// import { currentUser, Logout, User } from '../../../../../core/auth';

@Component({
    selector: 'kt-user-profile2',
    templateUrl: './user-profile2.component.html',
})
export class UserProfile2Component implements OnInit {
    // Public properties
    user$: Observable<any>;

    @Input() avatar = true;
    @Input() greeting = true;
    @Input() badge: boolean;
    @Input() icon: boolean;

    /**
	 * Component constructor
	 *
	 * @param store: Store<AppState>
	 */
    constructor() {
    }

    /**
	 * @ Lifecycle sequences => https://angular.io/guide/lifecycle-hooks
	 */

    /**
	 * On init
	 */
    ngOnInit(): void {
        this.user$ = of({});
    }

    /**
	 * Log out
	 */
    logout() {
      //  this.store.dispatch(new Logout());
    }
}
