import { SelectionModel } from '@angular/cdk/collections';
import { AfterViewInit, ChangeDetectorRef, Component, OnDestroy, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort, Sort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { Select, Store } from '@ngxs/store';
import { merge, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { Filter, QueryModel, ResponseModel, UserAccount } from '../../../../../models';
import { collectionInOut, CustomAnimationPlayer, ExtendedMatDialog, fadeIn, fadeInOutStagger, ParamGenService } from '../../../../../utils';

import { ClearCachedUsersOnDestroyAction, LoadLazyUserAction } from './store/users.store';
import { UserService } from './user-account.service';
import { UserMainComponent } from './user-main.component';
import { SnackToastService, DeleteConfirmComponent } from '../../../../shared';
// import { HubConnectionBuilder } from '@aspnet/signalr';

@Component({
    templateUrl: './user-account.component.html',
    animations: [fadeIn, fadeInOutStagger, collectionInOut],
    styleUrls: ['../../../../shared/shared.scss'],
})
export class UserAccountComponent implements AfterViewInit, OnDestroy {
    private readonly toDestroy$ = new Subject<void>();
    displayedColumns = ['details', 'select', 'id', 'fullName', 'address', 'role', 'username', 'status', 'action'];

    dataSource: MatTableDataSource<UserAccount> = new MatTableDataSource(null);
    @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
    @ViewChild(MatSort) sort: MatSort;
    selection = new SelectionModel<UserAccount>(true, []);
    expandedElement: UserAccount | null;

    isLoadingResults = true;

    // request query
    query: QueryModel = { filters: [] };

    hasFilter: boolean = this.paramGen.hasFilter;

    @Select('users_add_update', 'payload')
    userPayload$: Observable<ResponseModel>;

    selectedId: number;

    displaySubheader = false;

    constructor(
        private uService: UserService,
        private cdr: ChangeDetectorRef,
        private dialog: MatDialog,
        private nodify: SnackToastService,
        private dialogUtil: ExtendedMatDialog,
        private paramGen: ParamGenService,
        private store: Store,
        private cap: CustomAnimationPlayer
    ) { }

    ngAfterViewInit() {
       setTimeout(() => {
        this.cdr.markForCheck();
        // prevent position alter glitch
        this.displaySubheader = true;
       }, 800);

        // init default
       this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
       this.initData();

        // executes when table sort/paginator change happens.
       this.initEvents();

        // const connection = new HubConnectionBuilder().withUrl('http://192.168.100.4:4000/ChatHub').build();

        // connection.on('ReceiveMessage', function (user, message) {
        // 	console.log(user);
        // 	const msg = message.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        // 	const encodedMsg = '<b>' + user + '</b> says ' + msg;
        // 	const li = document.createElement('li');
        // 	li.innerHTML = encodedMsg;
        // 	document.getElementById('messagesList').appendChild(li);
        // });

        // connection.start().catch(function (err) {
        // 	return console.error(err.toString());
        // });

        // document.getElementById('sendButton').addEventListener('click', function (event) {
        // 	const user = (document.getElementById('userInput') as any).value;
        // 	const message = (document.getElementById('messageInput') as any).value;
        // 	connection.send('SendMessage', user, message).catch(function (err) {
        // 		return console.error(err.toString());
        // 	});
        // 	event.preventDefault();
        // });
    }

    ngOnDestroy() {

        this.store.dispatch(new ClearCachedUsersOnDestroyAction());


        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    rowDetailExpand(row: UserAccount) {
        this.expandedElement = this.expandedElement === row ? null : row;

        this.store.dispatch(new LoadLazyUserAction(row.guid));

    }

    trackById = (_: number, item: UserAccount) => item.id;

    updateStatus(s: string, id: number) {
        const row = this.dataSource.data.find(_ => _.id === id);
        if (row) {
            row.status = s;
        }
        // TODO: update to the API
        this.uService.updateStatus({ id: row.id, status: s }).pipe(
            takeUntil(this.toDestroy$),
        ).subscribe({
            next: res => [
                this.nodify.when('success', res, this.resetFlags),
                this.cap.animate('rubberBand', document.querySelector(`#status${id}`))
            ],
            error: e => this.nodify.when('danger', e, this.resetFlags)
        });
    }

    rowHeight(row: UserAccount) {
        return this.expandedElement === row ? { 'min-height': 'auto' } : { 'min-height': '0', border: '0' };
    }

    /** Whether the number of selected elements matches the total number of rows. */
    isAllSelected() {
        const numSelected = this.selection.selected.length;
        const numRows = this.dataSource.data.length;
        return numSelected === numRows;
    }

    /** Selects all rows if they are not all selected; otherwise clear selection. */
    masterToggle() {
        this.isAllSelected() ?
            this.selection.clear() :
            this.dataSource.data.forEach(row => this.selection.select(row));
    }

    onAction(id: number, guid: string) {
        this.selectedId = id;
        let instance: MatDialogRef<UserMainComponent, ResponseModel>;

        // dialog config
        instance = this.dialog.open(UserMainComponent, {
            width: '1000px',
            // since we use guid to store permission data from the next tab on edit mode,
            data: { id, guid },
            autoFocus: false,
        });

        // when user made changes on form and clicks to backdrop, animate a bit.
        this.dialogUtil.animateBackdropClick(instance);

        // use this to animate after dialog closed or so
        let resData: ResponseModel;

        // when a user get updated or or created
        this.userPayload$.pipe(
            filter(_ => _ && _.contentBody),
            takeUntil(this.toDestroy$),
        ).subscribe({
            next: res => {
                this.cdr.markForCheck();
                resData = res;
                // since state context creates readonly props, we have to create a copy of it to modify
                const d: UserAccount = { ...res.contentBody };
                const index = this.dataSource.data.findIndex(_ => _.id === d.id);
                if (index > -1) {
                    d.sn = this.dataSource.data[index].sn;
                    this.dataSource.data[index] = d;
                } else {
                    this.dataSource.data.unshift(d);
                }
                this.dataSource._updateChangeSubscription();
            },
            error: e => this.nodify.when('danger', e, () => this.resetFlags)
        });

        // when main dialog closes.
        instance.afterClosed().pipe(
            tap(_ => [this.cdr.markForCheck(), this.selectedId = 0]),
            filter(_ => resData ? true : false),
            takeUntil(this.toDestroy$),
        ).subscribe({
            next: _ => [
                this.dataSource._updateChangeSubscription(),
                resData && resData.contentBody.id > 0 ?
                    this.cap.animate('flash', document.querySelector(`#row${resData.contentBody.id}`), 900)
                    : null
            ]
        });
    }

    onDelete(id: number) {

        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(
                takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.uService.deleteUser(id)
                    .pipe(takeUntil(this.toDestroy$)))
            )
            .subscribe({
                next: res => {
                    this.cdr.markForCheck();
                    const index = this.dataSource.data.findIndex(_ => _.id === id);
                    if (index > -1) {
                        this.dataSource.data.splice(index, 1);
                        // decrease the length of total items
                        this.paginator.length--;
                    }

                    this.nodify.when('success', res, () => this.resetFlags);
                    this.dataSource._updateChangeSubscription();
                },
                error: e => this.nodify.when('danger', e, () => this.resetFlags)
            });

    }

    resetFilters() {
        this.cdr.markForCheck();
        if (this.sort) {
            this.sort.active = null;
            this.sort.direction = null;
        }
        this.query = { filters: [], sort: null };
        this.paramGen.clearParams();
        this.hasFilter = false;

        setTimeout(() => {
            this.initData();
        }, 200);
        this.dataSource._updateChangeSubscription();
    }

    filter(f: Filter, column: string) {
        const fl: Filter = { ...f, column };
        const index = this.query.filters.findIndex(_ => _.column === column);
        if (index > -1) {
            this.query.filters[index] = fl;
        } else {
            this.query.filters.push(fl);
        }

        this.initData();
    }

    private initData() {
        this.cdr.markForCheck();
        this.dataSource.data = [];
        this.isLoadingResults = true;

        this.uService.getUsers(this.query).pipe(takeUntil(this.toDestroy$), delay(600)).subscribe(res => {
            this.cdr.markForCheck();
            this.dataSource.data = (res.contentBody.items || []);
            this.paginator.length = (res.contentBody.totalItems || 0);
            this.isLoadingResults = false;

        }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }

    private initEvents() {
        const obs = [
            this.sort ? this.sort.sortChange : of(),
            this.paginator.page
        ];
        merge(...obs).pipe(
            debounceTime(100),
            takeUntil(this.toDestroy$)
        ).subscribe(event => {
            // clear selection
            this.selection.clear();

            // sort event
            if (( event as Sort).active) {
                // reset paginator to default when sort happens
                this.query.paginator = { pageIndex: 1, pageSize: this.paginator.pageSize };
                // const s = event as Sort;
                this.query.sort = { orderBy: this.sort.active, orderDirection: this.sort.direction };
            } else {
                this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
            }

            this.initData();
        });
    }

    private resetFlags() {
        this.isLoadingResults = false;
    }
}
