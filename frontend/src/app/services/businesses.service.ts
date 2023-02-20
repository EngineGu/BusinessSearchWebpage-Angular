import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SERVER_ADDRESS } from '../config/config';
import { Business } from '../config/data';

@Injectable({
  providedIn: 'root'
})

export class BusinessesService {

  ReceivedBusinessesList:Business[] = []
  ResultstableRefresh = false

  private businessUrl = SERVER_ADDRESS + '/businesses';

  constructor(
    private http: HttpClient,
  ) { }

    /** GET businesses by keyword, latitude, longitude, distance, category. */
    get(
      keyword: string,
      latitude:string,
      longitude:string,
      distance:string,
      category:string
      ):Observable<Business[]> {
      const url = `${this.businessUrl}?keyword=${keyword}&latitude=${latitude}&longitude=${longitude}&distance=${distance}&category=${category}`;
      return this.http.get<Business[]>(url);
    }

    
}
