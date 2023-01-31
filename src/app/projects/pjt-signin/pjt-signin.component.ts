import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-pjt-signin',
  templateUrl: './pjt-signin.component.html',
  styleUrls: ['./pjt-signin.component.css']
})
export class PjtSigninComponent implements OnInit {

  constructor(public ms:ModalService) { }

  ngOnInit(): void {
  }

}
