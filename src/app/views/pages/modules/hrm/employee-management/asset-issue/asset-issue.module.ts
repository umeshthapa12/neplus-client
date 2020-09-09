import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatCardPlaceholderModule, ChangesConfirmModule, DeleteConfirmModule } from '../../../../../../../../src/app/views/shared';
import { AssetIssueComponent } from './asset-issue.component';
import { AssetIssueFormComponent } from './asset-issue-form.component';
import { AssetIssueService } from './asset-issue.service';

@NgModule({
    declarations: [AssetIssueComponent, AssetIssueFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: AssetIssueComponent }
        ]),
        FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDatepickerModule,
        MatProgressSpinnerModule, MatDialogModule, MatDividerModule, MatCardModule,
        MatCardPlaceholderModule, ChangesConfirmModule, DeleteConfirmModule
    ],
    exports: [],
    providers: [AssetIssueService],
    entryComponents: [AssetIssueFormComponent]
})
export class AssetIssueModule { }
