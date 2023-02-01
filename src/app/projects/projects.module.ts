import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProjectsComponent } from './projects.component';
import { PjtHomeComponent } from './pjt-home/pjt-home.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';
import { MaterialModule } from '../material/material.module';
import { PjtTodoComponent } from './pjt-todo/pjt-todo.component';
import { PjtWeatherComponent } from './pjt-weather/pjt-weather.component';
import { PjtRubiksCubeComponent } from './pjt-rubiks-cube/pjt-rubiks-cube.component';
import { PjtBankAppComponent } from './pjt-bank-app/pjt-bank-app.component';
import { PjtCoffeeComponent } from './pjt-coffee/pjt-coffee.component';
import { PjtCameraComponent } from './pjt-camera/pjt-camera.component';
import { PjtSigninComponent } from './pjt-signin/pjt-signin.component';
import { PjtExpLearningComponent } from './pjt-exp-learning/pjt-exp-learning.component';
import { PjtPortfolioComponent } from './pjt-portfolio/pjt-portfolio.component';
import { PjtPortfolioTwoComponent } from './pjt-portfolio-two/pjt-portfolio-two.component';

@NgModule({
  declarations: [
    ProjectsComponent,
    PjtHomeComponent,
    PjtTodoComponent,
    PjtWeatherComponent,
    PjtRubiksCubeComponent,
    PjtBankAppComponent,
    PjtCoffeeComponent,
    PjtCameraComponent,
    PjtSigninComponent,
    PjtExpLearningComponent,
    PjtPortfolioComponent,
    PjtPortfolioTwoComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    SharedModule,
    MaterialModule
  ],
  exports: [
    ProjectsComponent
  ]
})
export class ProjectsModule { }
