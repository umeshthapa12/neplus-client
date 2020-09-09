import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatDialogModule } from '@angular/material/dialog';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AdditionalRecordComponent } from './additional-record.component';
import { AdditionalRecordFormComponent } from './additional-record-form.component';
import { AdditionalRecordService } from './additional-record.service';
import { MatMenuModule } from '@angular/material/menu';
import { NgxsModule } from '@ngxs/store';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatIconModule } from '@angular/material/icon';
import { DeleteConfirmModule, ChangesConfirmModule, FiltersModule } from '../../../../../../../../src/app/views/shared';
import { MatChipsModule } from '@angular/material/chips';
import { AutoChipComponent } from './child/auto-chip.component';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';

@NgModule({
    declarations: [AdditionalRecordComponent, AdditionalRecordFormComponent, AutoChipComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: AdditionalRecordComponent }
        ]),
        NgxsModule.forFeature([
        ]),
        FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,
        MatDialogModule, MatTableModule, MatPaginatorModule, MatCheckboxModule, MatSortModule, PerfectScrollbarModule,
        MatProgressBarModule, MatProgressSpinnerModule, MatTooltipModule, MatMenuModule,MatChipsModule,MatAutocompleteModule,
        MatIconModule,MatCardModule,MatDividerModule,
        DeleteConfirmModule, ChangesConfirmModule, FiltersModule
    ],
    exports: [],
    providers: [AdditionalRecordService],
    entryComponents: [AdditionalRecordFormComponent]
})
export class AdditionalRecordModule { }
