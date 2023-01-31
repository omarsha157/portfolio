import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevsHomeComponent } from './devs-home.component';

describe('DevsHomeComponent', () => {
  let component: DevsHomeComponent;
  let fixture: ComponentFixture<DevsHomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevsHomeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevsHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
