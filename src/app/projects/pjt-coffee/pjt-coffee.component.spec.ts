import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtCoffeeComponent } from './pjt-coffee.component';

describe('PjtCoffeeComponent', () => {
  let component: PjtCoffeeComponent;
  let fixture: ComponentFixture<PjtCoffeeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtCoffeeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtCoffeeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
