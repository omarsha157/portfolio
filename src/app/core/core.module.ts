import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CoreComponent } from './core.component';
import { CoreHomeComponent } from './core-home/core-home.component';
import { CoreAboutComponent } from './core-about/core-about.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { CoreContactComponent } from './core-contact/core-contact.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material/material.module';


@NgModule({
  declarations: [
    CoreComponent,
    CoreHomeComponent,
    CoreAboutComponent,
    CoreContactComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  exports: [
    CoreHomeComponent,
    CoreAboutComponent
  ]
})
export class CoreModule { }
