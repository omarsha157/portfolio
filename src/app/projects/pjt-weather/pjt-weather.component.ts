import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-pjt-weather',
  templateUrl: './pjt-weather.component.html',
  styleUrls: ['./pjt-weather.component.css']
})
export class PjtWeatherComponent implements OnInit {

  constructor(public ms:ModalService) { }

  ngOnInit(): void {
  }

}
