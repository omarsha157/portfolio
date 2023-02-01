import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-pjt-portfolio-two',
  templateUrl: './pjt-portfolio-two.component.html',
  styleUrls: ['./pjt-portfolio-two.component.css']
})
export class PjtPortfolioTwoComponent implements OnInit {

  constructor(public ms:ModalService) { }

  ngOnInit(): void {
  }

}
