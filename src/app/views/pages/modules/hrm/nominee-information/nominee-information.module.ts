import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ChangesConfirmModule, DeleteConfirmModule } from './../../../../shared';
import { NomineeInformationComponent } from './nominee-information.component';
import { NomineeInformationService } from './nominee-information.service';
import { NomineeInformationFormComponent } from './nominee-information-form.component';

@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        ReactiveFormsModule,
        FormsModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        ChangesConfirmModule,
        DeleteConfirmModule,
        RouterModule.forChild([
            { path: '', component: NomineeInformationComponent }
        ])
    ],
    declarations: [NomineeInformationComponent, NomineeInformationFormComponent],
    entryComponents: [NomineeInformationFormComponent],
    providers: [NomineeInformationService]
})
export class NomineeInformationModule { }
