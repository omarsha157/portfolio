import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtPortfolioTwoComponent } from './pjt-portfolio-two.component';

describe('PjtPortfolioTwoComponent', () => {
  let component: PjtPortfolioTwoComponent;
  let fixture: ComponentFixture<PjtPortfolioTwoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtPortfolioTwoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtPortfolioTwoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
