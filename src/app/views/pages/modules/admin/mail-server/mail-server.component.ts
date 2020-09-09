import { animate, query, stagger, style, transition, trigger } from '@angular/animations';
import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, TemplateRef, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { merge, Subject } from 'rxjs';
import { debounceTime, delay, filter, switchMap, takeUntil, tap } from 'rxjs/operators';
import { MailServer, QueryModel, ResponseModel } from '../../../../../models';
import { CustomAnimationPlayer, ExtendedMatDialog, ParamGenService } from '../../../../../utils';
import { CustomUtil } from '../../../../../utils/generators/custom-utility';
import { MailServerFormComponent } from './mail-server-form.component';
import { MailServerService } from './mail-server.service';
import { MatSelectChange } from '@angular/material/select';
import { SnackToastService, DeleteConfirmComponent } from '../../../../shared';

@Component({
    templateUrl: './mail-server.component.html',
    animations: [
        trigger('animateCollection', [
            transition('* <=> *', [
                query(':leave', [
                    stagger('10ms', [
                        animate('0.1s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 0, transform: 'translate(0, 40px)', height: '*', }))
                    ]),

                ], { optional: true }),
                query(':enter', [
                    style({ opacity: 0, transform: 'translate(0, 40px)', height: '*', }),
                    stagger('50ms', [
                        animate('0.4s cubic-bezier(0.4, 0.0, 0.2, 1)', style({ opacity: 1, transform: 'translate(0, 0)', height: '*', })),
                    ])
                ], { optional: true, limit: 50 }),
            ])
        ])
    ],
    styles: [`
        mat-expansion-panel-header{
            background: #f8f9ff;
        }
        .kt-widget13{
            padding-top: 1rem;
            padding-bottom:0;
        }
        .kt-widget13 .kt-widget13__item{
            transition:background .3s;
            align-items: flex-start;
            padding: 0 5px;
            padding-bottom: 0.25rem;
            padding-top: 0.25rem;
            margin:0;
        }
        .kt-widget13 .kt-widget13__item:hover{
            background: #fafcff;
        }
        .kt-widget13 .kt-widget13__item .kt-widget13__text{
            word-break: break-word;
        }
        .kt-widget13 .kt-widget13__item .kt-widget13__desc{
            text-align:right;

        }

        .sort-handler{
            cursor:move;
        }

    `]
})
export class MailServerComponent implements AfterViewInit {

    private readonly toDestroy$ = new Subject<void>();

    @ViewChild(MatPaginator, { static: true })
    private paginator: MatPaginator;
    @ViewChild(MatSort)
    private sort: MatSort;

    isLoadingResults = false;

    // request query
    query: QueryModel = { filters: [] };

    hasFilter: boolean = this.paramGen.hasFilter;

    data: MailServer[][] = [[], [], []];
    private utility = new CustomUtil();

    @ViewChild(MatAccordion)
    accordion: MatAccordion;
    expanded: boolean;

    listDropped = new EventEmitter<any>();

    private readonly chunkN = 3;

    constructor(
        private mService: MailServerService,
        private cdr: ChangeDetectorRef,
        private paramGen: ParamGenService,
        private notify: SnackToastService,
        private dialog: MatDialog,
        private dialogUtil: ExtendedMatDialog,
        private cap: CustomAnimationPlayer

    ) { }

    ngAfterViewInit() {

        // init default
        this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };
        this.initData();

        // executes when sort/paginator change happens.
        this.initEvents();

        this.listDropped.pipe(
            debounceTime(1500),
            switchMap(body => this.mService.updateOrder(body).pipe(takeUntil(this.toDestroy$))),
            takeUntil(this.toDestroy$)
        ).subscribe({
            next: _ => this.notify.when('success', _),
            error: _ => this.notify.when('danger', _)
        });
    }

    trackByIndexFn = (index: number, _: MailServer) => index;
    trackByFn = (_: number, item: MailServer) => item.id;

    panelSpaceFixer = (e: TemplateRef<ElementRef>) => {
        const el: HTMLElement = e.elementRef.nativeElement.parentElement;
        if (el) { el.style.padding = '0 10px 10px'; }
    }

    toggleAccordion() {
        this.expanded = !this.expanded;
        this.expanded ? this.accordion.openAll() : this.accordion.closeAll();
    }

    drop(event: CdkDragDrop<MailServer[]>) {

        let prevEl: MailServer;
        let curEl: MailServer;

        if (event.previousContainer === event.container) {
            moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

            prevEl = event.container.data[event.previousIndex];
            curEl = event.container.data[event.currentIndex];

        } else {

            transferArrayItem(
                event.previousContainer.data,
                event.container.data,
                event.previousIndex,
                event.currentIndex
            );

            prevEl = (event.previousContainer.data[event.previousIndex] || event.container.data[event.previousIndex]);
            curEl = event.container.data[event.currentIndex];

        }

        const body = {
            prevId: prevEl.id, prevOrder: prevEl.rowOrder,
            currentId: curEl.id, currentOrder: curEl.rowOrder
        };

        this.listDropped.emit(body);

    }

    updateStatus(s: string, id: number, parentIndex: number, el: HTMLElement) {
        const row = this.data[parentIndex].find(_ => _.id === id);
        if (!row) { return; }

        row.status = s;

        // TODO: update to the API
        this.mService.updateStatus({ id: row.id, status: s }).pipe(
            takeUntil(this.toDestroy$),
        ).subscribe({
            next: res => [
                this.notify.when('success', res),
                this.cap.animate('rubberBand', el)
            ],
            error: e => this.notify.when('danger', e)
        });
    }

    updateDefaults(s: MatSelectChange, id: number, parentIndex: number, el: HTMLElement) {
        const row = this.data[parentIndex].find(_ => _.id === id);
        if (!row || !row.userGuid) { return; }

        row.isDefault = s.value;

        // TODO: update to the API
        this.mService.updateStatus({ id: row.id, isDefault: s.value, userGuid: row.userGuid }).pipe(
            takeUntil(this.toDestroy$),
        ).subscribe({
            next: res => [
                this.notify.when('success', res),
                this.cap.animate('rubberBand', el)
            ],
            error: e => this.notify.when('danger', e)
        });
    }

    onAction(id: number, guid: string) {

        let instance: MatDialogRef<MailServerFormComponent, ResponseModel>;

        instance = this.dialog.open(MailServerFormComponent, {
            width: '800px',
            data: { id, guid },
            autoFocus: false,

        });

        this.dialogUtil.animateBackdropClick(instance);

        instance.afterClosed().pipe(
            filter(_ => _ && _.contentBody),
            takeUntil(this.toDestroy$),
            tap(this.itemChanged)
        ).subscribe({
            next: res => [this.notify.when('success', res)],
            error: e => this.notify.when('danger', e)
        });
    }

    onDelete(id: number, guid: string) {
        const instance = this.dialog.open(DeleteConfirmComponent);
        instance.afterClosed()
            .pipe(
                takeUntil(this.toDestroy$),
                filter(yes => yes),
                switchMap(() => this.mService.deleteMailServer(id, guid)
                    .pipe(takeUntil(this.toDestroy$)))
            ).subscribe({
                next: res => {
                    this.itemChanged(res, true);
                    this.notify.when('success', res);
                },
                error: e => this.notify.when('danger', e)
            });
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    trackById = (_: number, item: MailServer) => item.id;

    resetFilters() {
        this.cdr.markForCheck();
        if (this.sort) {
            this.sort.active = null;
            this.sort.direction = null;
        }
        this.query = { filters: [], sort: null };
        this.paramGen.clearParams();
        this.hasFilter = false;
    }

    private itemChanged = (res: ResponseModel, isDeleted?: boolean) => {
        try {
            if (!(res || res.contentBody)) { return; }
            this.cdr.markForCheck();

            /**  we have max 3 dimensional chunks of array
             destruct number must be the same as @prop this.chunkN */
            let [chunk1, chunk2, chunk3] = this.data;
            const d: MailServer = res.contentBody;

            if (!chunk1) { this.data[0] = []; chunk1 = []; }
            if (!chunk2) { this.data[1] = []; chunk2 = []; }
            if (!chunk3) { this.data[2] = []; chunk3 = []; }

            const c1i = chunk1 && chunk1.findIndex(_ => _.id === d.id);
            if (c1i > -1) {

                if (isDeleted) {
                    this.data[this.data.indexOf(chunk1)].splice(c1i, 1);
                } else {
                    // it means chunk 0 contains the modified element
                    this.data[this.data.indexOf(chunk1)][c1i] = d;
                }

                return;

            }
            const c2i = chunk2 && chunk2.findIndex(_ => _.id === d.id);
            if (c2i > -1) {
                if (isDeleted) {
                    this.data[this.data.indexOf(chunk2)].splice(c2i, 1);
                } else {
                    // it means chunk 1 contains the modified element
                    this.data[this.data.indexOf(chunk2)][c2i] = d;
                }
                return;

            }
            const c3i = chunk3 && chunk3.findIndex(_ => _.id === d.id);
            if (c3i > -1) {
                if (isDeleted) {
                    this.data[this.data.indexOf(chunk3)].splice(c3i, 1);
                } else {
                    // it means chunk 2 contains the modified element
                    this.data[this.data.indexOf(chunk3)][c3i] = d;
                }
                return;
            }

            // insert a new element
            if (!isDeleted) {

                // just add a new element on the 1st chunk of array

                const len1 = chunk1 && chunk1.length;
                const len2 = chunk2 && chunk2.length;
                const len3 = chunk3 && chunk3.length;

                const allEqual = len1 === len2 && len1 === len3 && len2 === len3;
                // groups are equal, add to the 0 index
                if (allEqual) { this.data[0].unshift(d); return; }

                const toMid = len1 !== len2 && len2 < len1;
                if (toMid) { this.data[1].unshift(d); return; }

                const toLast = len2 !== len3 && len3 < len2;
                if (toLast) { this.data[2].unshift(d); return; }
            }
        } catch (error) {
            console.log(error);
        }
    }

    private initData() {
        this.cdr.markForCheck();

        this.isLoadingResults = true;

        this.mService.getMailServers(this.query).pipe(takeUntil(this.toDestroy$), delay(1500)).subscribe(res => {
            this.cdr.markForCheck();
            this.data = this.utility.SplitToChunk<MailServer>(res.contentBody.items || [], this.chunkN);
            this.paginator.length = (res.contentBody.totalItems || 0);
            this.isLoadingResults = false;
        }, _ => [this.cdr.markForCheck(), this.isLoadingResults = false]);
    }

    private initEvents() {
        const obs = [
            // this.sort ? this.sort.sortChange : of(),
            this.paginator.page
        ];
        merge(...obs).pipe(
            debounceTime(100),
            takeUntil(this.toDestroy$)
        ).subscribe(_ => {

            this.query.paginator = { pageIndex: this.paginator.pageIndex + 1, pageSize: this.paginator.pageSize };

            this.initData();
        });
    }
}
