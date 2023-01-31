import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtTodoComponent } from './pjt-todo.component';

describe('PjtTodoComponent', () => {
  let component: PjtTodoComponent;
  let fixture: ComponentFixture<PjtTodoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtTodoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtTodoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
