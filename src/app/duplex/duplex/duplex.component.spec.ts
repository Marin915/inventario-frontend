import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DuplexComponent } from './duplex.component';

describe('DuplexComponent', () => {
  let component: DuplexComponent;
  let fixture: ComponentFixture<DuplexComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DuplexComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DuplexComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
