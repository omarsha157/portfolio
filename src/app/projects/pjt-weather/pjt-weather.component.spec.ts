import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtWeatherComponent } from './pjt-weather.component';

describe('PjtWeatherComponent', () => {
  let component: PjtWeatherComponent;
  let fixture: ComponentFixture<PjtWeatherComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtWeatherComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtWeatherComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
