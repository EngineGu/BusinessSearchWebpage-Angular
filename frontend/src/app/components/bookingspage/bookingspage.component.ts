import { Component, OnInit } from '@angular/core';
import {Reservation} from 'src/app/config/data';
import { ReservationService } from 'src/app/reservation.service';


@Component({
  selector: 'app-bookingspage',
  templateUrl: './bookingspage.component.html',
  styleUrls: ['./bookingspage.component.css']
})
export class BookingspageComponent implements OnInit {

  constructor(
    public reservationService:ReservationService,
  ) { }

  ngOnInit(): void {
  }

  ReservationExist(){
    if(localStorage.length>0){
      return true
    }else {
      return false
    }
  }

  GetAllReservations(){
    console.log(localStorage.length)
    var list:Reservation[] = []
    var keys = Object.keys(localStorage)
    for (var i = 0; i < keys.length; i++){
      list.push(JSON.parse(localStorage.getItem(keys[i])!))
  }
  return list
  }

  OnClickTrash(id:string){
    localStorage.removeItem(id)
    this.reservationService.CurrentDetailReserved=false
    window.alert('Reservation cancelled!');
  }
}
