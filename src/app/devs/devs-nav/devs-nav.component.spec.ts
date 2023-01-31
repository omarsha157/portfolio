import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevsNavComponent } from './devs-nav.component';

describe('DevsNavComponent', () => {
  let component: DevsNavComponent;
  let fixture: ComponentFixture<DevsNavComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevsNavComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevsNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
