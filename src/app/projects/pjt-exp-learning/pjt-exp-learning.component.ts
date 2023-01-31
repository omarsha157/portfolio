import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-pjt-exp-learning',
  templateUrl: './pjt-exp-learning.component.html',
  styleUrls: ['./pjt-exp-learning.component.css']
})
export class PjtExpLearningComponent implements OnInit {

  constructor(public ms:ModalService) { }

  ngOnInit(): void {
  }

}
