import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface StoragePaginator {
  results: Array<File>,
  page: number,
  limit: number,
  totalPages: number,
  totalResults: number
}

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) { }

  savePostImage(form: any): Observable<any> {
    return this.http.post<any>(environment.api + '/storage/savePostImage', form);
  }

  savePostVideo(form: any): Observable<any> {
    return this.http.post<any>(environment.api + '/storage/savePostVideo', form);
  }

  getPrivateFile(caminho: string): string {
    caminho = caminho.startsWith("storage") ? caminho.substring("storage".length + 1) : caminho;
    return environment.origin + caminho;
  }
}