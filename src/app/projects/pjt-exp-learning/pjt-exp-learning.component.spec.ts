import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtExpLearningComponent } from './pjt-exp-learning.component';

describe('PjtExpLearningComponent', () => {
  let component: PjtExpLearningComponent;
  let fixture: ComponentFixture<PjtExpLearningComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtExpLearningComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtExpLearningComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
