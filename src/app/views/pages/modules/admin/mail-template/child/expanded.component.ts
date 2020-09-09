import { ChangeDetectorRef, Component, HostBinding, OnDestroy, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil, tap, delay } from 'rxjs/operators';
import { MailTemplate } from '../../../../../../models';

@Component({
    selector: 'expanded-lazy-content',
    templateUrl: './expanded.component.html',
})
export class ExpandedComponent implements OnInit, OnDestroy {
    // bind class to its host -> `<expanded-lazy-content>`
    @HostBinding('class')
    private class = ' w-100';

    private readonly toDestroy$ = new Subject<void>();

    content: MailTemplate;

    isLoading = true;

    // name of the slice -> stateName.actionArg
    @Select('mail_templates', 'lazy')
    mailTemplate: Observable<MailTemplate>;

    constructor(private cdr: ChangeDetectorRef) { }

    ngOnInit() {
        this.mailTemplate.pipe(
            filter(_ => _ && _.id > 0),
            takeUntil(this.toDestroy$),
            tap(res => [this.cdr.markForCheck(), this.content = res, this.isLoading = false]),
            delay(10)
        ).subscribe({
            next: res => {
                const el = document.querySelector('#mail-body');
                el ? el.innerHTML = res.body : null;
            }
        });
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
