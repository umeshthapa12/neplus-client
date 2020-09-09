import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'expanded-content',
    templateUrl: './expanded.component.html',
})
export class ExpandedComponent implements OnInit, OnDestroy {
    @HostBinding('class')
    private class = ' w-100';

    private readonly toDestroy$ = new Subject<void>();

    // name of the slice -> stateName.actionArg
    @Select('employees_lazy_data', 'lazy')
    users$: Observable<any>;

    content: any;

    isLoading = true;

    constructor(
        private cdr: ChangeDetectorRef
    ) { }

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
