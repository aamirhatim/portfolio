import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OmniComponent } from './omni.component';

describe('OmniComponent', () => {
  let component: OmniComponent;
  let fixture: ComponentFixture<OmniComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OmniComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OmniComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
