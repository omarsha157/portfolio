import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';

import { ScreenWidthService } from '../screen-width.service';

import { PjtTodoComponent } from '../pjt-todo/pjt-todo.component';
import { PjtWeatherComponent } from '../pjt-weather/pjt-weather.component';
import { Subscription } from 'rxjs';
import { PjtRubiksCubeComponent } from '../pjt-rubiks-cube/pjt-rubiks-cube.component';
import { PjtBankAppComponent } from '../pjt-bank-app/pjt-bank-app.component';
import { PjtCoffeeComponent } from '../pjt-coffee/pjt-coffee.component';
import { PjtCameraComponent } from '../pjt-camera/pjt-camera.component';
import { PjtSigninComponent } from '../pjt-signin/pjt-signin.component';
import { PjtExpLearningComponent } from '../pjt-exp-learning/pjt-exp-learning.component';
import { PjtPortfolioComponent } from '../pjt-portfolio/pjt-portfolio.component';


@Component({
  selector: 'app-pjt-home',
  templateUrl: './pjt-home.component.html',
  styleUrls: ['./pjt-home.component.css']
})
export class PjtHomeComponent implements OnInit {

  isMobile = true
  widthSubscription?:Subscription

  projectComponentName = {
    'todo': PjtTodoComponent,
    'weather':PjtWeatherComponent,
    'rubiks':PjtRubiksCubeComponent,
    'portfolio':PjtPortfolioComponent,
    'bank':PjtBankAppComponent,
    'coffee':PjtCoffeeComponent,
    'camera':PjtCameraComponent,
    'signin':PjtSigninComponent,
    'learning':PjtExpLearningComponent,
  }

  constructor(private dialog: MatDialog, private sw:ScreenWidthService) { }

  ngOnInit(): void {
    this.widthSubscription = this.sw.width.subscribe(res => {
      if(res < 960) {
        this.isMobile = true
      } else {
        this.isMobile = false
      }
    })
  }

  ngOnDestroy() {
    this.widthSubscription?.unsubscribe()
  }

  openModal(event:any) {
    let component = this.projectComponentName[event as keyof object]
    this.dialog.open(component)
  }

}
