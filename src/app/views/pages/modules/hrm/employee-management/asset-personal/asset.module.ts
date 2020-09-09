import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogModule } from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatCardPlaceholderModule, ChangesConfirmModule, DeleteConfirmModule } from '../../../../../../../../src/app/views/shared';
import { AssetService } from './asset.service';
import { AssetComponent } from './asset.component';
import { AssetFormComponent } from './asset-form.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
@NgModule({
    declarations: [AssetComponent, AssetFormComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: AssetComponent }
        ]), FormsModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatSelectModule, MatDialogModule,
        MatCardModule, MatDividerModule, MatDatepickerModule, MatProgressSpinnerModule,
        MatCardPlaceholderModule, ChangesConfirmModule, DeleteConfirmModule
    ],
    exports: [],
    providers: [AssetService],
    entryComponents: [AssetFormComponent]
})
export class AssetModule { }
