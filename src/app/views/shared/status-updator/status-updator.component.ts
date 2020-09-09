import { ChangeDetectorRef, Component, Input, OnInit, HostBinding, Output, EventEmitter } from '@angular/core';
import { Select } from '@ngxs/store';
import { Observable } from 'rxjs';
import { DropdownModel } from '../../../services';
import { fadeInOutStagger, RowContentStatus } from '../../../utils';
import { MatSelectChange } from '@angular/material/select';
import { DropdownStateSelector } from '../../../store/selectors';

@Component({
    selector: 'status-updator',
    templateUrl: './status-updator.component.html',
    animations: [fadeInOutStagger],
    styles: [`
        mat-option{
            height: 2rem !important;
        }
        .status-wrap{
            display: flex; flex-direction: row;  flex-wrap: wrap
        }
    `]
})
export class StatusUpdatorComponent implements OnInit {

    @HostBinding('class') private class = 'w-100';

    @Select(DropdownStateSelector.SliceOf('RowStatus')) status$: Observable<DropdownModel[]>;

    constructor(
        // private cdr: ChangeDetectorRef,
        private rowStatus: RowContentStatus, ) { }

    // @Input() isStatusChanging: boolean;
    // @Input() isStatusChanged: boolean;
    @Input() currentStatus: string;

    @Output() statusChanged = new EventEmitter<string>();

    ngOnInit() {    }

    selectionChange(s: MatSelectChange) {
        this.statusChanged.emit(s.value);
    }

    contentStatus = (s: string) => this.rowStatus.initContentStatusCssClass(s);


}
