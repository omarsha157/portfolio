import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtPortfolioComponent } from './pjt-portfolio.component';

describe('PjtPortfolioComponent', () => {
  let component: PjtPortfolioComponent;
  let fixture: ComponentFixture<PjtPortfolioComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtPortfolioComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtPortfolioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
