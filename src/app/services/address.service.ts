import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Country } from '../models/country.model';
import { Observable } from 'rxjs';
import { State } from '../models/state.model';
import { City } from '../models/city.model';

const baseUrl = environment.api + '/addresses';

@Injectable({
  providedIn: 'root'
})
export class AddressService {

  constructor(private http: HttpClient) {}

  getAllCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(baseUrl + '/getAllCountries');
  }

  getStates(countryId: number): Observable<State[]> {
    return this.http.post<State[]>(baseUrl + '/getStates', {countryId});
  }

  getCities(stateId: number): Observable<City[]> {
    return this.http.post<City[]>(baseUrl + '/getCities', {stateId});
  }

  getCity(cityId: number): Observable<City> {
    return this.http.post<City>(baseUrl + '/getCity', {cityId});
  }
}