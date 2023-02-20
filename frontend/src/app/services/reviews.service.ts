import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SERVER_ADDRESS } from '../config/config';
import { Review } from '../config/data';

@Injectable({
  providedIn: 'root'
})

export class ReviewsService {

  private reviewUrl = SERVER_ADDRESS + '/businesses';

  constructor(
    private http: HttpClient,
  ) { }

    /** GET reviews by id. */
    get(
      id: string,
      ):Observable<Review[]> {
      const url = `${this.reviewUrl}/${id}/reviews`;
      return this.http.get<Review[]>(url);
    }
}
