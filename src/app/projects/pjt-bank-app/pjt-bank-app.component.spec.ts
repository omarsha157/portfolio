import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtBankAppComponent } from './pjt-bank-app.component';

describe('PjtBankAppComponent', () => {
  let component: PjtBankAppComponent;
  let fixture: ComponentFixture<PjtBankAppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtBankAppComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtBankAppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
