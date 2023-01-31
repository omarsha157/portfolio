import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PjtRubiksCubeComponent } from './pjt-rubiks-cube.component';

describe('PjtRubiksCubeComponent', () => {
  let component: PjtRubiksCubeComponent;
  let fixture: ComponentFixture<PjtRubiksCubeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PjtRubiksCubeComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PjtRubiksCubeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
