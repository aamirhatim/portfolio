import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DayZeroComponent } from './day-zero.component';

describe('DayZeroComponent', () => {
  let component: DayZeroComponent;
  let fixture: ComponentFixture<DayZeroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DayZeroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DayZeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
