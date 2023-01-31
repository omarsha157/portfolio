import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreContactComponent } from './core-contact.component';

describe('CoreContactComponent', () => {
  let component: CoreContactComponent;
  let fixture: ComponentFixture<CoreContactComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreContactComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreContactComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
