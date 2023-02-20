import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BookingspageComponent } from './bookingspage.component';


describe('BookingspageComponent', () => {
  let component: BookingspageComponent;
  let fixture: ComponentFixture<BookingspageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BookingspageComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BookingspageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
