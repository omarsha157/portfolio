import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-pjt-rubiks-cube',
  templateUrl: './pjt-rubiks-cube.component.html',
  styleUrls: ['./pjt-rubiks-cube.component.css']
})
export class PjtRubiksCubeComponent implements OnInit {

  constructor(public ms:ModalService) { }

  ngOnInit(): void {
  }

}
