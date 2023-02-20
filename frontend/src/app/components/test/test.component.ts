import { Component, OnInit } from '@angular/core';

import { AutocompleteService } from 'src/app/services/autocomplete.service';
import { BusinessesService } from 'src/app/services/businesses.service';
import { DetailService } from 'src/app/services/detail.service';
import { GeocodeService } from 'src/app/services/geocode.service';
import { IpinfoService } from 'src/app/services/ipinfo.service';
import { ReviewsService } from 'src/app/services/reviews.service';

@Component({
  selector: 'app-test',
  templateUrl: './test.component.html',
  styleUrls: ['./test.component.css']
})
export class TestComponent implements OnInit {
  textList:string[]=[]

  constructor(
    private autocompleteService: AutocompleteService,
    private businessesService: BusinessesService,
    private detailService: DetailService,
    private geocodeService: GeocodeService,
    private ipinfoService: IpinfoService,
    private reviewsService: ReviewsService,
  ) { }

  ngOnInit(): void {

    // this.autocompleteService.get("bur")
    // .subscribe(autocompleteTextList => {
    //   console.log(autocompleteTextList)
    // }); 

    // this.businessesService.get("burger","34.022350","-118.285118","10","all")
    // .subscribe(businessesList => {
    //   console.log(businessesList)
    // });

    // this.detailService.get("Nm1iV8Aaat4EF_0hPevXhg")
    // .subscribe(detail => {
    //   console.log(detail)
    // });

    // this.geocodeService.get("USC")
    // .subscribe(geocode => {
    //   console.log(geocode)
    // });

    // this.reviewsService.get("Nm1iV8Aaat4EF_0hPevXhg")
    // .subscribe(reviews => {
    //   console.log(reviews)
    // });

    // this.ipinfoService.get()
    // .subscribe(ipinfo => {
    //   var latitude = String(ipinfo.loc).split(",")[0]
    //   var longitude = String(ipinfo.loc).split(",")[1]
    //   var geoInfo = {"latitude":latitude,"longitude":longitude}
    //   console.log(geoInfo)
    // })
  }
}
