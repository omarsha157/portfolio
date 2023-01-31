import { Component, OnInit } from '@angular/core';
import { ModalService } from '../modal.service';

@Component({
  selector: 'app-pjt-todo',
  templateUrl: './pjt-todo.component.html',
  styleUrls: ['./pjt-todo.component.css']
})
export class PjtTodoComponent implements OnInit {

  constructor(public ms:ModalService) { }

  ngOnInit(): void {
  }

}
