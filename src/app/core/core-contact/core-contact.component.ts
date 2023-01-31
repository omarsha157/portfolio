import { Component, OnInit } from '@angular/core';
import { FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-core-contact',
  templateUrl: './core-contact.component.html',
  styleUrls: ['./core-contact.component.css']
})
export class CoreContactComponent implements OnInit {

  email = new FormControl('', [Validators.required, Validators.email]);

  constructor() { }

  ngOnInit(): void {
  }

  getErrorMessage() {
    if (this.email.hasError('required')) {
      return 'please enter email';
    }

    return this.email.hasError('email') ? 'Not a valid email' : '';
  }

}
