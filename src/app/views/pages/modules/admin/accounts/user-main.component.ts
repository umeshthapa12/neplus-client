import { CdkDrag } from '@angular/cdk/drag-drop';
import { AfterViewInit, Component, OnDestroy, ViewChild } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { debounceTime, filter, takeUntil } from 'rxjs/operators';
import { ResponseModel, UserAccount } from '../../../../../models';
import { ExtendedMatDialog } from '../../../../../utils';

@Component({
    templateUrl: './user-main.component.html',
})
export class UserMainComponent implements OnDestroy, AfterViewInit {

    private readonly toDestory$ = new Subject<void>();

    @Select('users_add_update', 'payload')
    userPayload$: Observable<ResponseModel>;

    selected = 0;
    isUserCreated: boolean;

    @ViewChild(CdkDrag, { static: true })
    private drag: CdkDrag;

    constructor(private exDialog: ExtendedMatDialog) {
        this.userPayload$.pipe(
            filter(_ => _ && _.contentBody),
            takeUntil(this.toDestory$),
            debounceTime(400)
        ).subscribe(_ => {
            const d: UserAccount = _.contentBody;
            const hasGuid = (d.guid || '').trim().length > 0;
            // if the content has guid, it mean we are done with info tab and move to permission tab
            this.selected = hasGuid ? 1 : 0;
            this.isUserCreated = hasGuid;
        });
    }

    ngAfterViewInit() {
        // enable/disable dialog container transparent when drag and move
        this.exDialog.makeTransparentWhenDragMmove(this.drag);
    }

    ngOnDestroy() {
        this.toDestory$.next();
        this.toDestory$.complete();

    }
}
