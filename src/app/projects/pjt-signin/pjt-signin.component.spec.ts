import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtSigninComponent } from './pjt-signin.component';

describe('PjtSigninComponent', () => {
  let component: PjtSigninComponent;
  let fixture: ComponentFixture<PjtSigninComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtSigninComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtSigninComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
