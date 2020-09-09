import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { RouterModule } from '@angular/router';
import { PartialsModule } from '../../../../partials/partials.module';
import { ToastSnackbarModule, DirectivesModule } from '../../../../shared';
import { ProfileComponent } from './profile.component';

@NgModule({
    declarations: [ProfileComponent],
    imports: [
        CommonModule,
        RouterModule.forChild([
            { path: '', component: ProfileComponent }
        ]),
        FormsModule,
        ReactiveFormsModule,
        PartialsModule,
        MatFormFieldModule,
        MatInputModule,
        ToastSnackbarModule,
        DirectivesModule

    ],
    exports: [],
    providers: [],
})
export class ProfileModule { }
