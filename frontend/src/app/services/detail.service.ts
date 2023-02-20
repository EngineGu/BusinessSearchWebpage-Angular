import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SERVER_ADDRESS } from '../config/config';
import { Detail } from '../config/data';


@Injectable({
  providedIn: 'root'
})

export class DetailService {

  private detailUrl = SERVER_ADDRESS + '/businesses';

  constructor(
    private http: HttpClient,
  ) { }

    /** GET business detail by id. */
    get(
      id: string,
      ):Observable<Detail> {
      const url = `${this.detailUrl}/${id}`;
      return this.http.get<Detail>(url);
    }
}
