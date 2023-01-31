import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-docs-make-navbar',
  templateUrl: './docs-make-navbar.component.html',
  styleUrls: ['./docs-make-navbar.component.css']
})
export class DocsMakeNavbarComponent implements OnInit {

  myCode = `<nav>
              <div routerLink="" class="logo">
                <img src=">
              </div>
              <ul [ngClass]="isMenuOpen ? 'nav-active' : '' " class="navlinks">
                  <li [ngClass]="isUrlHome ? 'hide-home' : ''" ><a routerLink="">Home</a></li>
                  <li [ngClass]="isUrlAbout ? 'nav-highlight' : ''"><a routerLink="/core/about">About</a></li>
                  <li [ngClass]="isUrlProjects ? 'nav-highlight' : ''"><a routerLink="/projects">Projects</a></li>
                  <li [ngClass]="isUrlContact ? 'nav-highlight' : ''"><a routerLink="/core/contact">Contact</a></li>
                  <li><a href="./assets/resume.pdf" download="omarsha-resume.pdf">Resume</a></li>
                  <li><a routerLink="/devs"></a></li>
              </ul>
              <div [ngClass]="isMenuOpen ? 'burger-close' : '' " (click)="menuToggle()" class="burger">
                  <div class="line-1"></div>
                  <div class="line-2"></div>
                  <div class="line-3"></div>
              </div>
            </nav>`

  constructor() { }

  ngOnInit(): void {
  }

}
