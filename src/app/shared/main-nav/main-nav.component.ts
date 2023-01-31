import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main-nav',
  templateUrl: './main-nav.component.html',
  styleUrls: ['./main-nav.component.css']
})
export class MainNavComponent implements OnInit {

  isMenuOpen = false

  isUrlHome = false
  isUrlAbout = false
  isUrlProjects = false
  isUrlContact = false

  constructor(private rt:Router) { }

  ngOnInit(): void {
    if(this.rt.url == '/core/home') {
      this.isUrlHome = true
    } else if(this.rt.url == '/core/about') {
      this.isUrlAbout = true
    } else if(this.rt.url == '/projects/pjt-home') {
      this.isUrlProjects = true
    } else if(this.rt.url == '/core/contact') {
      this.isUrlContact = true
    }
  }

  menuToggle() {
    this.isMenuOpen = !this.isMenuOpen
  }

}
