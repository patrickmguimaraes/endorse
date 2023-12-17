import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Person } from '../models/person.model';
import { environment } from '../../environments/environment';

const baseUrl = environment.api + '/people';

@Injectable({
  providedIn: 'root'
})
export class PersonService {

  constructor(private http: HttpClient) {}

  login(email: string): Observable<Person> {
    return this.http.get<Person>(`${baseUrl}/login/${email}`);
  }

  getAll(): Observable<Person[]> {
    return this.http.get<Person[]>(baseUrl);
  }

  get(id: any): Observable<Person> {
    return this.http.get<Person>(`${baseUrl}/${id}`);
  }

  create(data: Person): Observable<Person> {
    return this.http.post<Person>(baseUrl, data);
  }

  update(id: any, data: Person): Observable<Person> {
    return this.http.put<Person>(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  findByName(title: any): Observable<Person[]> {
    return this.http.get<Person[]>(`${baseUrl}?name=${title}`);
  }
}
