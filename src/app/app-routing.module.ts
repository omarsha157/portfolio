import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';


import { CoreAboutComponent } from './core/core-about/core-about.component';
import { CoreContactComponent } from './core/core-contact/core-contact.component';
import { CoreHomeComponent } from './core/core-home/core-home.component';
import { CoreComponent } from './core/core.component';
import { DevsDocsComponent } from './devs/devs-docs/devs-docs.component';
import { DevsHomeComponent } from './devs/devs-home/devs-home.component';
import { DevsWorkInProgressComponent } from './devs/devs-work-in-progress/devs-work-in-progress.component';
import { DevsComponent } from './devs/devs.component';
import { DocsMakeNavbarComponent } from './devs/docs-make-navbar/docs-make-navbar.component';
import { PagenotfoundComponent } from './pagenotfound/pagenotfound.component';
import { PjtHomeComponent } from './projects/pjt-home/pjt-home.component';
import { ProjectsComponent } from './projects/projects.component';


const routes: Routes = [
  {path: '' , redirectTo:'core', pathMatch: 'full'},
  {path: 'core', component:CoreComponent,
  children: [
    {path:'', redirectTo:'home', pathMatch:'full'},
    {path:'home', component:CoreHomeComponent},
    {path:'about', component:CoreAboutComponent},
    {path:'contact', component:CoreContactComponent}
]},
  {path:'projects', component: ProjectsComponent,
    children: [
      {path:'',redirectTo:'pjt-home',pathMatch:'full'},
      {path: 'pjt-home', component:PjtHomeComponent}
    ]
  },
  {path:'devs', component: DevsComponent, children: [
    {path:'', redirectTo:'devs-home',pathMatch:'full'},
    {path:'devs-home',component:DevsHomeComponent},
    {path:'workInProgress', component:DevsWorkInProgressComponent},
    {path:'docs', component:DevsDocsComponent},
    {path:'make-navbar', component:DocsMakeNavbarComponent},

  ]},
  {path:'**', component:PagenotfoundComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
