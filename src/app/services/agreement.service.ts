import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Agreement } from '../models/agreement.model';

const baseUrl = environment.api + '/termsAndConditions';

@Injectable({
  providedIn: 'root'
})
export class AgreementService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Agreement[]> {
    return this.http.get<Agreement[]>(baseUrl + "/getAll");
  }
}
