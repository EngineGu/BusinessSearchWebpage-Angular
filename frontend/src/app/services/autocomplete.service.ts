import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { SERVER_ADDRESS } from '../config/config';

@Injectable({
  providedIn: 'root'
})

export class AutocompleteService {

  private autocompleteUrl = SERVER_ADDRESS + '/autocomplete';

  constructor(
    private http: HttpClient,
  ) { }

  /** GET autocomplete by text. */
  get(text: string): Observable<string[]> {
    const url = `${this.autocompleteUrl}?text=${text}`;
    return this.http.get<string[]>(url);
  }
}
