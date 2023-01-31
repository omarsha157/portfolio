import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DocsMakeNavbarComponent } from './docs-make-navbar.component';

describe('DocsMakeNavbarComponent', () => {
  let component: DocsMakeNavbarComponent;
  let fixture: ComponentFixture<DocsMakeNavbarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DocsMakeNavbarComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DocsMakeNavbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
