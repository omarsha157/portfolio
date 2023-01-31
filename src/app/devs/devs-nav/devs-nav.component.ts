import { Component, OnInit, ElementRef, HostListener } from '@angular/core';

@Component({
  selector: 'app-devs-nav',
  templateUrl: './devs-nav.component.html',
  styleUrls: ['./devs-nav.component.css']
})
export class DevsNavComponent implements OnInit {

  isMenuOpen = false
  menu = "menu"
  
  constructor(private eRef:ElementRef) {
  }

  ngOnInit(): void {
  }

  changeMenu() {
    this.isMenuOpen = !this.isMenuOpen
    this.menu = this.isMenuOpen ? 'close' : 'menu'
  }

  closeMenu() {
    this.isMenuOpen = false
    this.menu = 'menu'
  }

  @HostListener('document:click', ['$event'])
  clickout(event:any) {
    if(!this.eRef.nativeElement.contains(event.target)) {
      this.closeMenu()
    }
  }

}
