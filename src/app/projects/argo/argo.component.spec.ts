import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ArgoComponent } from './argo.component';

describe('ArgoComponent', () => {
  let component: ArgoComponent;
  let fixture: ComponentFixture<ArgoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ArgoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ArgoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
