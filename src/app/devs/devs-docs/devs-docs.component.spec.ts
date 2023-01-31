import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DevsDocsComponent } from './devs-docs.component';

describe('DevsDocsComponent', () => {
  let component: DevsDocsComponent;
  let fixture: ComponentFixture<DevsDocsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DevsDocsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DevsDocsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
