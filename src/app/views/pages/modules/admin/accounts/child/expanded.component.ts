import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { UserAccount } from '../../../../../../models';

@Component({
    selector: 'expanded-lazy-content',
    templateUrl: './expanded.component.html',
})
export class ExpandedComponent implements OnInit, OnDestroy {
    // bind class to its host -> `<expanded-lazy-content>`
    @HostBinding('class')
    private class = ' w-100';

    private readonly toDestroy$ = new Subject<void>();

    content: UserAccount;

    isLoading = true;

    // name of the slice -> stateName.actionArg
    @Select('users_lazy_data', 'lazy')
    users$: Observable<UserAccount>;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.users$.pipe(
            filter(_ => _ && _.id > 0),
            takeUntil(this.toDestroy$),
        ).subscribe(res => [this.cdr.markForCheck(), this.content = res, this.isLoading = false]);
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
