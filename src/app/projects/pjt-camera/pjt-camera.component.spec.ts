import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtCameraComponent } from './pjt-camera.component';

describe('PjtCameraComponent', () => {
  let component: PjtCameraComponent;
  let fixture: ComponentFixture<PjtCameraComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtCameraComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtCameraComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
