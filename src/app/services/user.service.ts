import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';
import { environment } from '../../environments/environment';

const baseUrl = environment.api + '/users';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) {}

  login(email: string): Observable<User> {
    return this.http.get<User>(`${baseUrl}/login/${email}`);
  }

  existsEmail(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${baseUrl}/exists/${email}`);
  }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(baseUrl);
  }

  get(id: any): Observable<User> {
    return this.http.get<User>(`${baseUrl}/${id}`);
  }

  update(id: any, data: User): Observable<User> {
    return this.http.put<User>(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  findByName(title: any): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}?name=${title}`);
  }

  retriveAllEmployees(companiesId: Array<number>): Observable<User[]> {
    return this.http.post<User[]>(`${baseUrl}/retriveAllEmployees`, companiesId);
  }

  attachProfilePicture(file: FormData, id: number): Observable<any> {
    return this.http.post<any>(`${baseUrl}/attachProfilePicture/${id}`, file);
  }
}
