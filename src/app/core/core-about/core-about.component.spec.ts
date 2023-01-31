import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CoreAboutComponent } from './core-about.component';

describe('CoreAboutComponent', () => {
  let component: CoreAboutComponent;
  let fixture: ComponentFixture<CoreAboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CoreAboutComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CoreAboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
