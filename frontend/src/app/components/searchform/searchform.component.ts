import { Component, OnInit,ViewEncapsulation,Input } from '@angular/core';
import $ from "jquery";

import { Output, EventEmitter } from '@angular/core';
import {AfterViewInit, ElementRef, ViewChild} from '@angular/core';
import { FormControl, FormGroup,FormBuilder, Validators} from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { debounceTime, tap, switchMap, finalize, distinctUntilChanged, filter } from 'rxjs/operators';
import { NgbActiveModal, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ReactiveFormsModule } from '@angular/forms';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';





import { AutocompleteService } from 'src/app/services/autocomplete.service';
import { BusinessesService } from 'src/app/services/businesses.service';
import { DetailService } from 'src/app/services/detail.service';
import { GeocodeService } from 'src/app/services/geocode.service';
import { IpinfoService } from 'src/app/services/ipinfo.service';
import { ReviewsService } from 'src/app/services/reviews.service';
import { ReservationService } from 'src/app/reservation.service';


import { Geocode } from 'src/app/config/data';
import { Detail } from 'src/app/config/data';
import { Business } from 'src/app/config/data';
import { Review } from 'src/app/config/data';
import {Reservation} from 'src/app/config/data';

import { ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';


@Component({
  selector: 'app-searchform',
  templateUrl: './searchform.component.html',
  styleUrls: ['./searchform.component.css'],
  encapsulation: ViewEncapsulation.None
})

export class SearchformComponent implements OnInit {

  constructor(
    private http: HttpClient,
    private ipinfoService: IpinfoService,
    private geocodeService: GeocodeService,
    private businessesService: BusinessesService,
    private autocompleteService:AutocompleteService,
    private detailService:DetailService,
    private reviewsService:ReviewsService,
    public reservationService:ReservationService,
    private modalService: NgbModal,
    private formBuilder:FormBuilder,
  ) { }

  //autocomplete
  searchMoviesCtrl = new FormControl();
  filteredMovies: any;
  isLoading = false;
  errorMsg!: string;
  minLengthTerm = 3;
  keywordFromForm: any = "";

  onSelected() {
    console.log(this.keywordFromForm);
    $('#InputKeyword').val(this.keywordFromForm)
    this.keywordFromForm = this.keywordFromForm;
  }

  displayWith(value: any) {
    return value?.Title;
  }

  clearSelection() {
    this.keywordFromForm = "";
    this.filteredMovies = [];
  }

  ngOnInit(): void {
    //autocomplete
    this.searchMoviesCtrl.valueChanges
      .pipe(
        filter(res => {
          return res !== null && res.length >= this.minLengthTerm
        }),
        distinctUntilChanged(),
        debounceTime(1000),
        tap(() => {
          this.errorMsg = "";
          this.filteredMovies = [];
          this.isLoading = true;
        }),
        switchMap(value => this.autocompleteService.get(value)
          .pipe(
            finalize(() => {
              this.isLoading = false
            }),
          )
        )
      )
      .subscribe((data: any) => {
        console.log(1)
        console.log(data)
        if (data == undefined) {
          this.filteredMovies = [];
        } else {
          this.errorMsg = "";
          this.filteredMovies = data;
        }
        console.log(2)
        console.log(this.filteredMovies);
      });

      //modal
      //validation
      this.reservationForm = this.formBuilder.group(
        {
          inputEmail:['',[Validators.required,Validators.email]],
          inputDate:['',Validators.required],
          inputHour:['',Validators.required],
          inputMin:['',Validators.required],
        }
      )


    }
  


  // control var
  IsShowResultsTable = false
  IsShowResultsTableEmpty = false
  IsShowDetailCard = false

  // SearchPage
  BusinessesList:Business[] = []
  distanceFromForm = ""
  locationFromForm = ""
  categoryFromForm="Default"

  OnAutoDetectCheckChanged() {
    if (($('#AutoDetectCheck').is(":checked"))) {
      $("#InputLocation").prop("disabled",true)
      this.locationFromForm=""
    } else {
      $("#InputLocation").prop("disabled",false)
    }
  }

  AfterSubmit(businessesList:Business[]){
    this.businessesService.ReceivedBusinessesList = businessesList
    this.businessesService.ResultstableRefresh = true
    this.BusinessesList = businessesList
    this.IsShowResultsTable = true
  }

  onSubmitSearchForm(){
    this.IsShowResultsTable = false
    this.IsShowResultsTableEmpty = false
    this.IsShowDetailCard = false  
    // Check Fields Validity
    if(!((<HTMLInputElement>($('#InputKeyword')[0])).checkValidity())){
      (<HTMLInputElement>($('#InputKeyword')[0])).reportValidity()
      return 0
    }
    if(!((<HTMLInputElement>($('#InputCategory')[0])).checkValidity())){
      (<HTMLInputElement>($('#InputCategory')[0])).reportValidity()
      return 0
    }
    if(!((<HTMLInputElement>($('#InputLocation')[0])).checkValidity())){
      (<HTMLInputElement>($('#InputLocation')[0])).reportValidity()
      return 0
    }
    var keyword = this.keywordFromForm
    var distance=""
    if(this.distanceFromForm ==""){
      distance="10"
    }else{
      distance = this.distanceFromForm
    }
    
    var catetory = this.categoryFromForm
    var latitude = ""
    var longitude = ""
    if (($('#AutoDetectCheck').is(":checked"))){
      this.ipinfoService.get()
      .subscribe(ipinfo => {
        latitude = String(ipinfo.loc).split(",")[0]
        longitude = String(ipinfo.loc).split(",")[1]
        this.businessesService.get(keyword,latitude,longitude,distance,catetory)
        .subscribe(businessesList => {
          if(businessesList.length==0){
            this.IsShowResultsTable = false
            this.IsShowResultsTableEmpty = true
            this.IsShowDetailCard = false
          }else{
            this.AfterSubmit(businessesList)
          }
        });
      })
    } else {
      this.geocodeService.get(this.locationFromForm)
      .subscribe(geocode => {
        if(JSON.stringify(geocode)=="{}"){
          this.IsShowResultsTable = false
          this.IsShowResultsTableEmpty = true
          this.IsShowDetailCard = false
        }else{
          latitude = geocode.latitude.toString()
          longitude = geocode.longitude.toString()
          this.businessesService.get(keyword,latitude,longitude,distance,catetory)
          .subscribe(businessesList => {
            if(businessesList.length==0){
              this.IsShowResultsTable = false
              this.IsShowResultsTableEmpty = true
              this.IsShowDetailCard = false
            }else{
              this.AfterSubmit(businessesList)
            }
          });
        }
      });
    }
    return 0
  }

  OnClear(){
    // Restore SearchForm Fields 
    this.keywordFromForm = ""
    this.distanceFromForm = ""
    this.locationFromForm = ""
    this.categoryFromForm="Default"
    $('#AutoDetectCheck').prop('checked', false);
    $("#InputLocation").prop("disabled",false)
    this.IsShowResultsTable = false
    this.IsShowDetailCard = false
    this.IsShowResultsTableEmpty = false
    this.BusinessesList = []
    this.clearSelection()
  }

  // detail Card
  currentDetailId:string=""
  details: Detail={    
    name: "",
    status: "",
    category: "",
    address: "",
    coordinates: {
        latitude: 0,
        longitude: 0,
    },
    phoneNumber: "",
    price:"",
    moreInfoLink:"",
    photoLinks:[],
    twitterLink:"",
    facebookLink:"",
  }
  reviewsList:Review[]=[]

  mapOptions: google.maps.MapOptions = {
    center: { lat: 38.9987208, lng: -77.2538699 },
    zoom : 14
  }
  marker = {
    position: { lat: 38.9987208, lng: -77.2538699 },
  }

  OnClickBusiness(id:string){
    this.currentDetailId=id
    if(window.localStorage.getItem(this.currentDetailId) === null){
      this.reservationService.CurrentDetailReserved = false
    } else {
      this.reservationService.CurrentDetailReserved = true
    }
    this.detailService.get(id).subscribe(
      data => {
        this.details = data
        console.log(this.details.twitterLink)
        this.mapOptions.center!.lat=this.details.coordinates.latitude
        this.mapOptions.center!.lng=this.details.coordinates.longitude
        this.marker.position!.lat = this.details.coordinates.latitude
        this.marker.position!.lng=this.details.coordinates.longitude
        this.reviewsService.get(id).subscribe(
          data => {
            this.reviewsList=data
          }
        )
      }
    )
    this.IsShowResultsTable = false
    this.IsShowResultsTableEmpty = false
    this.IsShowDetailCard = true
  }

  OnClickArrow(){
    this.IsShowResultsTable = true
    this.IsShowResultsTableEmpty = false
    this.IsShowDetailCard = false
    this.details = {    
      name: "",
      status: "",
      category: "",
      address: "",
      coordinates: {
          latitude: 0,
          longitude: 0,
      },
      phoneNumber: "",
      price:"",
      moreInfoLink:"",
      photoLinks:[],
      twitterLink:"",
      facebookLink:"",
    }
  }

  OnClickCancelRsvBtn(){
    window.localStorage.removeItem(this.currentDetailId)
    this.reservationService.CurrentDetailReserved = false
    window.alert('Reservation cancelled!');
  }

  //modal
  reservationForm!:FormGroup
  reservationFormSubmitted=false;
  onSubmitReservationForm(){
    this.reservationFormSubmitted = true
    if(this.reservationForm.invalid){
      return
    } else {
      //input valid
      // var dateObject=this.reservationForm.get("inputDate")!.value
      // var dateString = dateObject.year + "-" + dateObject.month + "-" + dateObject.day
      var Reservation= {
        id: this.currentDetailId,
        name:this.details.name,
        date: this.reservationForm.get("inputDate")!.value,
        time: (this.reservationForm.get("inputHour")!.value + ":" + this.reservationForm.get("inputMin")!.value),
        email:this.reservationForm.get("inputEmail")!.value
      }
      window.localStorage.setItem(this.currentDetailId,JSON.stringify(Reservation))
      this.reservationService.CurrentDetailReserved = true
      window.alert('Reservation created!');
      this.reservationFormSubmitted = false
      this.reservationForm.reset();
      $('#closeRsvForm').trigger("click")
    }
  }


  OnClickRsvSubmitBtn(){
}

  OnClickTwitter(){
    var url=this.details.twitterLink
    window.open(url, '_blank');
  }

  
  OnClickFacebook(){
    var url=this.details.facebookLink
    window.open(url, '_blank');
  }
}
