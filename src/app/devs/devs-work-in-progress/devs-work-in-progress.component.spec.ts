import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevsWorkInProgressComponent } from './devs-work-in-progress.component';

describe('DevsWorkInProgressComponent', () => {
  let component: DevsWorkInProgressComponent;
  let fixture: ComponentFixture<DevsWorkInProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevsWorkInProgressComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevsWorkInProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
