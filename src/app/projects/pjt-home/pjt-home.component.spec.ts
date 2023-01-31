import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtHomeComponent } from './pjt-home.component';

describe('PjtHomeComponent', () => {
  let component: PjtHomeComponent;
  let fixture: ComponentFixture<PjtHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
