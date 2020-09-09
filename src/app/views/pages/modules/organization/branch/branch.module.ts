import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSortModule } from '@angular/material/sort';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDialogModule } from '@angular/material/dialog';
import { HttpClientModule } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { PerfectScrollbarModule } from 'ngx-perfect-scrollbar';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatPaginatorModule } from '@angular/material/paginator';
import { FiltersModule } from './../../../../shared/filters/filters.module';
import { BranchFormComponent } from './branch-form.component';
import { BranchComponent } from './branch.component';
import { BranchService } from './branch.service';

@NgModule({
    imports: [
        CommonModule,
        MatProgressSpinnerModule,
        PerfectScrollbarModule,
        MatCardModule,
        MatPaginatorModule,
        HttpClientModule,
        MatDialogModule,
        FormsModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        MatOptionModule,
        MatSelectModule,
        MatTooltipModule,
        FiltersModule,
        MatSortModule,
        MatCheckboxModule,
        RouterModule.forChild([
            { path: '', component: BranchComponent }
        ])
    ],
    declarations: [BranchComponent, BranchFormComponent],
    entryComponents: [BranchFormComponent],
    providers: [BranchService]
})
export class BranchModule { }
