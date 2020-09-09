// Angular
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
// Pages
import { CoreModule } from '../../core/core.module';
// Partials
import { PartialsModule } from '../partials/partials.module';
@NgModule({
    declarations: [],
    exports: [],
    imports: [
        CommonModule,
        FormsModule,
        CoreModule,
        PartialsModule,
    ],
    providers: []
})
export class PagesModule {
}
