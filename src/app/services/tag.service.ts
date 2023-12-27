import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Tag } from '../models/tag';

const baseUrl = environment.api + '/tags';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private http: HttpClient) { }

  findOrCreate(tag: string): Observable<Tag> {
    return this.http.post<Tag>(`${baseUrl}/findOrCreate`, { tag });
  }
}
