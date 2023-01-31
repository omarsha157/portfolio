import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-pjt-bank-app',
  templateUrl: './pjt-bank-app.component.html',
  styleUrls: ['./pjt-bank-app.component.css']
})
export class PjtBankAppComponent implements OnInit {

  constructor(public ms:ModalService) { }

  ngOnInit(): void {
  }

}
