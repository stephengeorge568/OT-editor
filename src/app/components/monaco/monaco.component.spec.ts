import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MonacoComponent } from './monaco.component';

describe('MonacoComponent', () => {
  let component: MonacoComponent;
  let fixture: ComponentFixture<MonacoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ MonacoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(MonacoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
