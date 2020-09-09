import { SelectionModel } from '@angular/cdk/collections';
import { FlatTreeControl } from '@angular/cdk/tree';
import { AfterViewInit, ChangeDetectionStrategy, Component, Inject, OnDestroy } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTreeFlatDataSource, MatTreeFlattener } from '@angular/material/tree';
import { Select } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { delay, filter, takeUntil } from 'rxjs/operators';
import { ErrorCollection, PermissionData, ResponseModel, UserAccount } from '../../../../../models';
import { collectionInOut, fadeIn, fadeInOutStagger } from '../../../../../utils';
import { UserService } from './user-account.service';
import { UserMainComponent } from './user-main.component';
import { SnackToastService, ChangesConfirmComponent } from '../../../../shared';

@Component({
    selector: 'user-permission',
    templateUrl: './user-permission.component.html',
    animations: [fadeInOutStagger, collectionInOut, fadeIn],
    changeDetection: ChangeDetectionStrategy.OnPush,
    styles: [`
        mat-tree{
            min-height: 300px;
        }
        mat-tree-node{
            transition: background .2s ease-in;
            height:30px !important;
            min-height:30px !important;
        }
        mat-tree-node:hover{
            background: #f7f7f7;
        }
        .parent-label{
            margin-left: 5px;
            font-size: 11px;
            font-style: italic;
            color: #969696;
        }
        .toggle-btn{
            height: 25px; width:25px; line-height: unset
        }
        .mat-dialog-content{
            margin: 0px !important;
            padding:0px;
        }
    `]
})
export class UserPermissionComponent implements OnDestroy, AfterViewInit {
    /**
     * Use this to append guid to the permission data collection.
     */
    private userGuid: string;

    constructor(
        private readonly uService: UserService,
        private readonly notify: SnackToastService,
        private dialogRef: MatDialogRef<UserMainComponent>,
        private dialog: MatDialog,
        @Inject(MAT_DIALOG_DATA)
        public readonly data: { id: number, guid?: string }) {

        this.userPayload$.pipe(
            filter(_ => _ && _.contentBody),
            takeUntil(this.toDestroy$)
        ).subscribe({
            next: _ => {
                const d: UserAccount = _.contentBody;
                this.userGuid = d.guid;
            }
        });

    }

    private readonly toDestroy$ = new Subject<void>();
    isError: boolean;
    responseMessage: string;
    errors: ErrorCollection[];
    isWorking: boolean;
    treeChanged: boolean;
    checklistSelection = new SelectionModel<PermissionData>(true /* multiple */);

    treeControl = new FlatTreeControl<PermissionData>(node => node.level, node => node.children && node.children.length > 0);
    private transformer = (node: PermissionData, level: number) => {
        return {
            expandable: node.children && node.children.length > 0,
            name: node.name,
            level,
            ...node
        };
    }
    // tslint:disable-next-line: member-ordering
    private treeFlattener = new MatTreeFlattener(
        this.transformer,
        node => node.level,
        node => node.children && node.children.length > 0,
        node => node.children
    );

    // tslint:disable-next-line: member-ordering
    dataSource = new MatTreeFlatDataSource(this.treeControl, this.treeFlattener);



    /**
     * User response object from the store when create or update happens
     */
    // tslint:disable-next-line: member-ordering
    @Select('users_add_update', 'payload')
    userPayload$: Observable<ResponseModel>;

    getLevel = (node: PermissionData) => node.level;

    ngAfterViewInit() {

        this.initPermissionData();
    }

    private initPermissionData() {
        this.uService.getPermissionData(this.data.guid).pipe(
            takeUntil(this.toDestroy$)
        ).subscribe({ next: res => this.initTreeData(res), error: e => this.notify.when('danger', e) });
    }

    private initTreeData(res: ResponseModel) {

        const p: PermissionData[] = res.contentBody;

        const scope = this;

        // assign the tree nodes first
        this.treeControl.dataNodes = p;
        this.dataSource.data = p;

        if (!this.data.guid) {
            // expand all by level===0
            this.treeControl.dataNodes.filter(_ => _.level === 0)
                .forEach(node => this.treeControl.expand(node));
        }

        // items are always an array.
        function recursiveTreeNodeFn(items: PermissionData[] = []) {

            items.forEach(node => {

                // main level is always expanded
                if (node.level === 0) {
                    scope.treeControl.expand(node);
                }


                // it mean this node has user access
                if (node && node.hasUserAccess) {
                    scope.itemSelectionToggle(node);
                    scope.treeControl.expand(node);
                }

                // call the fn recursively for its cildren.
                recursiveTreeNodeFn(node.children);
            });
        }
        // call the fn to iterate through tree control nodes
        recursiveTreeNodeFn(this.treeControl.dataNodes);

        // expand descendants by selected node
        this.checklistSelection.selected.forEach(node => this.treeControl.expandDescendants(node));
    }

    private prepSystemPermissionData() {
        // get node collections
        const dataArr = this.treeControl.dataNodes;

        // filter items by conditions
        const sys = dataArr.filter(obj =>
            // exclude nav IDs here
            obj.resourceType !== 'nav_id' &&
            // filter user access
            obj.hasUserAccess
        );

        if (!(sys.length > 0)) { return null; }

        // init a collection placeholder
        const sysItems: PermissionData[] = [];

        sys.forEach(el => {

            // get resource object by comparing id === parentId from child to parent
            const resourceEl = this.treeControl.dataNodes.find(_ =>
                _.id === el.parentId &&
                _.resourceType === el.resourceType
            );

            if (!resourceEl) { return; }

            // collect operations for this resource,
            const operations = sys.filter(_ => _.parentId === resourceEl.id && _.hasUserAccess)
                .map(_ => _.value)
                .filter((operation, index, all) => all.indexOf(operation) === index);

            // extract payload data only
            const obj: PermissionData = {
                userPermissionId: el.userPermissionId,
                // either guid from edit mode or from new user created response object
                guid: (this.data.guid || this.userGuid),
                module: resourceEl.module,
                value: resourceEl.value,
                resourceType: resourceEl.resourceType,
                area: resourceEl.area,
                permissionItems: operations
            };

            // add to the payload placeholder
            sysItems.push(obj);
        });

        // dedupe by value
        return sysItems.filter((obj, index, arr) => arr.map(m => m.value).indexOf(obj.value) === index);
    }

    private prepNavIdspermissionData() {

        // gets nav data only
        const navs = this.treeControl.dataNodes.filter(_ => _.resourceType === 'nav_id');
        // gets user permitted values only.
        const items = navs.filter(v => v.hasUserAccess)
            // dedupe by Id
            .filter((obj, pos, arr) => arr.map(m => m.id).indexOf(obj.id) === pos);
        if (!(items.length > 0)) { return null; }

        // we only need an item
        const [item] = items;
        const parentNavIds = items.filter(_ => _.parentId)
            .map(_ => _.parentId)
            .filter((_, i, a) => a.indexOf(_) === i);

        // main object for the Payload
        const d: PermissionData = {
            userPermissionId: item.userPermissionId,
            // either guid from edit mode or from new user created response object
            guid: (this.data.guid || this.userGuid),
            area: item.area,
            resourceType: item.resourceType,
            value: item.value,
            module: item.module,
            // merge all IDs to the permission data collection
            permissionItems: [...items.map(_ => _.id), ...parentNavIds]
        };

        return d;
    }

    private permissionPayload(): PermissionData[] {
        const navs = (this.prepNavIdspermissionData());
        const resource = this.prepSystemPermissionData();
        return [].concat(navs ? navs : []).concat(resource ? resource : []);
    }

    ngOnDestroy() {
        this.toDestroy$.next();
        this.toDestroy$.complete();
    }

    /** whether the node has children */
    hasChild = (_: number, node: PermissionData) => node.expandable;

    saveChanges() {

        this.clearErrors();

        const items = this.permissionPayload();

        // check whether the user guid test has been passed
        const hasGuid = (this.userGuid || this.data.guid || '').length > 0;

        if (!hasGuid) {
            // if we come this far, tell user to create an user account first so we can add permissions
            this.isError = true;
            this.responseMessage = 'Oops! You can\'t add permissions without creating an user. Did you forget to create an user from the `Basic Controls` tab? ';
            return false;
        }

        if (!(items.length > 0)) {
            // user may mistakenly clicks to the submit button without selecting any checkboxes
            this.isError = true;
            this.responseMessage = 'No checkbox has been selected yet. Please select one or more checkboxes and try again.';
            return false;
        }

        this.isWorking = true;

        // so far so good, lets submit the payload
        this.uService.updatePermission(items).pipe(
            takeUntil(this.toDestroy$),
            delay(800)
        ).subscribe({
            next: res => [
                this.isWorking = false,
                this.dialogRef.close(),
                this.notify.when('success', res, () => this.clearErrors)
            ],
            error: e => {

                this.isError = true;
                this.isWorking = false;
                const model: ResponseModel = e.error;
                const errors: ErrorCollection[] = model.contentBody.errors;

                // Check if server returning number of error list
                if (errors && errors.length > 0) {
                    this.errors = errors;
                    this.responseMessage = model.messageBody;
                }
            }
        });
    }

    /** Toggle a leaf item selection. Check all the parents to see if they changed */
    leafItemSelectionToggle(node: PermissionData) {

        // toggle value
        node.hasUserAccess = !node.hasUserAccess;

        this.checklistSelection.toggle(node);
        this.checkAllParentsSelection(node);
    }

    /* Checks all the parents when a leaf node is selected/unselected */
    checkAllParentsSelection(node: PermissionData): void {
        let parent: PermissionData = this.getParentNode(node);
        while (parent) {
            this.checkRootNodeSelection(parent);
            parent = this.getParentNode(parent);
        }
    }

    /** Check root node checked state and change it accordingly */
    checkRootNodeSelection(node: PermissionData): void {

        const nodeSelected = this.checklistSelection.isSelected(node);
        const descendants = this.treeControl.getDescendants(node);
        const descAllSelected = descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        if (nodeSelected && !descAllSelected) {
            this.checklistSelection.deselect(node);
        } else if (!nodeSelected && descAllSelected) {
            this.checklistSelection.select(node);
        }
    }
    /* Get the parent node of a node */
    getParentNode(node: PermissionData): PermissionData | null {
        const currentLevel = this.getLevel(node);

        if (currentLevel < 1) {
            return null;
        }

        const startIndex = this.treeControl.dataNodes.indexOf(node) - 1;

        for (let i = startIndex; i >= 0; i--) {
            const currentNode = this.treeControl.dataNodes[i];

            if (this.getLevel(currentNode) < currentLevel) {
                return currentNode;
            }
        }
        return null;
    }

    /** Whether all the descendants of the node are selected. */
    descendantsAllSelected(node: PermissionData): boolean {

        const descendants = this.treeControl.getDescendants(node);

        if (descendants.length === 0) {
            return this.checklistSelection.isSelected(node);
        }

        return descendants.every(child => this.checklistSelection.isSelected(child));
    }

    /** Whether part of the descendants are selected */
    descendantsPartiallySelected(node: PermissionData): boolean {
        const descendants = this.treeControl.getDescendants(node);
        const result = descendants.some(child => this.checklistSelection.isSelected(child));

        return result && !this.descendantsAllSelected(node);
    }

    /** Toggle the item selection. Select/deselect all the descendants node */
    itemSelectionToggle(node: PermissionData): void {

        this.checklistSelection.toggle(node);
        const descendants = this.treeControl.getDescendants(node);
        const isSelected = this.checklistSelection.isSelected(node);

        isSelected
            ? this.checklistSelection.select(...descendants)
            : this.checklistSelection.deselect(...descendants);

        // Force update for the parent
        descendants.every(child =>
            this.checklistSelection.isSelected(child)
        );
        this.checkAllParentsSelection(node);

        /** when checkbox toggle happens, toggle `hasUserAccess` property to filter and prepare API payload */
        function userAccessUpdater(items: PermissionData[]) {

            items.forEach(n => {
                const noChildren = !(n.children && n.children.length > 0);
                n.hasUserAccess = noChildren && isSelected;
                if (!noChildren) {
                    userAccessUpdater(n.children);
                }
            });
        }

        userAccessUpdater(descendants);

    }

    onCancel() {
        if (this.treeChanged) {
            this.dialog.open(ChangesConfirmComponent).afterClosed()
                .pipe(filter(_ => _))
                .subscribe(_ => this.dialogRef.close());
        } else {
            this.dialogRef.close();
        }
    }

    getIcon(node: PermissionData) {
        switch (node.resourceType) {
            case 'nav_id':
                return 'fa-link kt-font-info';
            default:
                const i = node.value === 'full' ? 'flaticon-interface-6 kt-font-info'
                    : node.value === 'create' ? 'flaticon-edit kt-font-primary'
                        : node.value === 'read' ? 'flaticon-list-3 kt-font-success'
                            : node.value === 'update' ? 'flaticon2-reload kt-font-warning'
                                : node.value === 'delete' ? 'flaticon2-trash kt-font-danger'
                                    : '';
                return i;

        }
    }

    clearErrors() {
        this.isError = false;
        this.responseMessage = null;
        this.errors = null;
    }
}
