import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Company } from '../models/company.model';
import { environment } from '../../environments/environment';
import { Category } from '../models/category.model';
import { Copyright } from '../models/copyright.model';

const baseUrl = environment.api + '/companies';
const baseUrlCategory = environment.api + '/categories';
const baseUrlCopyright = environment.api + '/copyrights';

@Injectable({
  providedIn: 'root'
})
export class CompanyService {

  constructor(private http: HttpClient) {}

  login(email: string): Observable<Company> {
    return this.http.get<Company>(`${baseUrl}/login/${email}`);
  }

  getAll(): Observable<Company[]> {
    return this.http.get<Company[]>(baseUrl);
  }

  get(id: any): Observable<Company> {
    return this.http.get<Company>(`${baseUrl}/${id}`);
  }

  create(data: Company): Observable<Company> {
    return this.http.post<Company>(baseUrl, data);
  }

  update(id: any, data: Company): Observable<Company> {
    return this.http.put<Company>(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }
 
  findByCategory(category: number): Observable<Company[]> {
    return this.http.get<Company[]>(`${baseUrl}/findByCategory/${category}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(private http: HttpClient) {}

  login(email: string): Observable<Category> {
    return this.http.get<Category>(`${baseUrlCategory}/login/${email}`);
  }

  getAll(): Observable<Category[]> {
    return this.http.get<Category[]>(baseUrlCategory);
  }

  get(id: any): Observable<Category> {
    return this.http.get<Category>(`${baseUrlCategory}/${id}`);
  }

  create(data: Category): Observable<Category> {
    return this.http.post<Category>(baseUrlCategory, data);
  }

  update(id: any, data: Category): Observable<Category> {
    return this.http.put<Category>(`${baseUrlCategory}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrlCategory}/${id}`);
  }

  findByName(title: any): Observable<Category[]> {
    return this.http.get<Category[]>(`${baseUrlCategory}?name=${title}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class CopyrightService {

  constructor(private http: HttpClient) {}

  login(email: string): Observable<Copyright> {
    return this.http.get<Copyright>(`${baseUrlCopyright}/login/${email}`);
  }

  getAll(): Observable<Copyright[]> {
    return this.http.get<Copyright[]>(baseUrlCopyright);
  }

  get(id: any): Observable<Copyright> {
    return this.http.get<Copyright>(`${baseUrlCopyright}/${id}`);
  }

  create(data: Copyright): Observable<Copyright> {
    return this.http.post<Copyright>(baseUrlCopyright, data);
  }

  update(id: any, data: Copyright): Observable<Copyright> {
    return this.http.put<Copyright>(`${baseUrlCopyright}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrlCopyright}/${id}`);
  }

  findByName(title: any): Observable<Copyright[]> {
    return this.http.get<Copyright[]>(`${baseUrlCopyright}?name=${title}`);
  }
}
