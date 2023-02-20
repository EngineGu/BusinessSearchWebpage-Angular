import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SERVER_ADDRESS } from '../config/config';
import { Geocode } from '../config/data';

@Injectable({
  providedIn: 'root'
})

export class GeocodeService {

  private geocodeUrl = SERVER_ADDRESS + '/geocode';

  constructor(
    private http: HttpClient,
  ) { }

    /** GET geocode by address. */
    get(
      address: string,
      ):Observable<Geocode> {
      const url = `${this.geocodeUrl}?address=${address}`;
      return this.http.get<Geocode>(url);
    }
}
