import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, HostBinding, OnDestroy, ViewChild, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import * as q from 'quill';
import { Observable, Subject } from 'rxjs';
import { filter, takeUntil } from 'rxjs/operators';
import { JobSeeker } from '../../../../../../models';
const Quill: any = q;
@Component({
    selector: 'expanded-lazy-content',
    templateUrl: './expanded.component.html',
})
export class ExpandedComponent implements OnDestroy, OnInit {
    // bind class to its host -> `<expanded-lazy-content>`
    @HostBinding('class')
    private class = ' w-100';

    private readonly toDestroy$ = new Subject<void>();

    content: JobSeeker;

    isLoading = true;

    // name of the slice -> stateName.actionArg
    @Select('jobseekers', 'lazy')
    company$: Observable<JobSeeker>;

    @ViewChild('aboutMe', { read: ElementRef, static: true })
    private aboutEl: ElementRef;

    constructor(private cdr: ChangeDetectorRef) { }
    ngOnInit() {
        const q = new Quill(this.aboutEl.nativeElement, {
            readOnly: true,
            modules: {
                toolbar: false
            }
        });


        this.company$.pipe(
            filter(_ => _ && _.id > 0),
            takeUntil(this.toDestroy$),
        ).subscribe({
            next: _ => [
                this.cdr.markForCheck(),
                this.isLoading = false,
                this.content = _,
                q.setContents(_ && _.aboutMe ? JSON.parse(_.aboutMe) : [])
            ]
        });
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

}
