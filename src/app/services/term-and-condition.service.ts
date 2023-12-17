import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { TermAndCondition } from '../models/term-and-condition.model';

const baseUrl = environment.api + '/termsAndConditions';

@Injectable({
  providedIn: 'root'
})
export class TermAndConditionService {

  constructor(private http: HttpClient) {}

  getLast(): Observable<TermAndCondition> {
    return this.http.get<TermAndCondition>(baseUrl + "/getLast");
  }
}
