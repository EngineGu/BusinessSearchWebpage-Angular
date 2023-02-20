import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { MY_IPINFO_API_TOKEN } from '../config/config';
import { IpInfo } from '../config/data';

@Injectable({
  providedIn: 'root'
})

export class IpinfoService {

  private ipinfoUrl = "https://ipinfo.io/?token=" + MY_IPINFO_API_TOKEN;

  constructor(
    private http: HttpClient,
  ) { }

    /** GET businesses by keyword, latitude, longitude, distance, category. */
    get():Observable<IpInfo> {
      const url = this.ipinfoUrl;
      return this.http.get<IpInfo>(url);
    }
}
