import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { StatusUpdatorComponent } from './status-updator.component';

@NgModule({
    declarations: [StatusUpdatorComponent],
    imports: [CommonModule, MatProgressSpinnerModule, MatSelectModule],
    exports: [StatusUpdatorComponent],
    providers: [],
})
export class StatusUpdatorModule { }
