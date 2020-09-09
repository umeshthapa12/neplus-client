import { MatDialogModule } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { DeleteConfirmModule, ChangesConfirmModule } from './../../../../shared';
import { ServiceInformationService } from './service-information.service';
import { ServiceInformationComponent } from './service-information.component';
import { ServiceInformationFormComponent } from './service-information-form.component';


@NgModule({
    imports: [
        CommonModule,
        MatCardModule,
        MatProgressSpinnerModule,
        MatTooltipModule,
        MatFormFieldModule,
        MatInputModule,
        ReactiveFormsModule,
        FormsModule,
        MatSelectModule,
        MatDatepickerModule,
        DeleteConfirmModule,
        ChangesConfirmModule,
        MatDialogModule,
        RouterModule.forChild([
            {
                path: '',
                component: ServiceInformationComponent
            }
        ])
    ],
    declarations: [ServiceInformationComponent, ServiceInformationFormComponent],
    entryComponents: [ServiceInformationFormComponent],
    providers: [ServiceInformationService]
})
export class ServiceInformationModule { }
