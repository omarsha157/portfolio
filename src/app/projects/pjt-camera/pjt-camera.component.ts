import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-pjt-camera',
  templateUrl: './pjt-camera.component.html',
  styleUrls: ['./pjt-camera.component.css']
})
export class PjtCameraComponent implements OnInit {

  constructor(public ms:ModalService) { }

  ngOnInit(): void {
  }

}
