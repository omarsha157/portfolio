import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-pjt-portfolio',
  templateUrl: './pjt-portfolio.component.html',
  styleUrls: ['./pjt-portfolio.component.css']
})
export class PjtPortfolioComponent implements OnInit {

  constructor(public ms:ModalService) { }

  ngOnInit(): void {
  }

}
