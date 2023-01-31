import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DevsComponent } from './devs.component';
import { RouterModule } from '@angular/router';
import { DevsHomeComponent } from './devs-home/devs-home.component';
import { DevsNavComponent } from './devs-nav/devs-nav.component';
import { DevsWorkInProgressComponent } from './devs-work-in-progress/devs-work-in-progress.component';
import { DevsDocsComponent } from './devs-docs/devs-docs.component';
import { DocsMakeNavbarComponent } from './docs-make-navbar/docs-make-navbar.component';


@NgModule({
  declarations: [
    DevsComponent,
    DevsHomeComponent,
    DevsNavComponent,
    DevsWorkInProgressComponent,
    DevsDocsComponent,
    DocsMakeNavbarComponent
  ],
  imports: [
    CommonModule,
    RouterModule
  ]
})
export class DevsModule { }
