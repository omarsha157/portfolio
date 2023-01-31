import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-pjt-coffee',
  templateUrl: './pjt-coffee.component.html',
  styleUrls: ['./pjt-coffee.component.css']
})
export class PjtCoffeeComponent implements OnInit {

  constructor(public ms:ModalService) { }

  ngOnInit(): void {
  }

}
