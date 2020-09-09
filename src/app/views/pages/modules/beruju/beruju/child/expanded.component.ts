import { Component, OnInit, OnDestroy, HostBinding, ChangeDetectorRef } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { Select } from '@ngxs/store';
import { filter, takeUntil } from 'rxjs/operators';

@Component({
    selector: 'expanded-lazy-beruju',
    templateUrl: './expanded.component.html'
})

export class ExpandedComponent implements OnInit, OnDestroy {
    @HostBinding('class')
    private class = ' w-100';

    private readonly toDestroy$ = new Subject<void>();

    content: any;

    isLoading = true;

    // name of the slice -> stateName.actionArg
    @Select('berujus_lazy_data', 'lazy')
    berujus$: Observable<any>;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.berujus$.pipe(
            filter(_ => _ && _.id > 0),
            takeUntil(this.toDestroy$),
        ).subscribe(res => [this.cdr.markForCheck(), this.content = res, this.isLoading = false]);
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
