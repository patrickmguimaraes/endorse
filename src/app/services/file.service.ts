import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = environment.api + '/files';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  attachShowcaseFile(file: FormData, postId: number): Observable<any> {
    return this.http.post<any>(`${baseUrl}/attachFile`, {file: file, postId: postId});
  }
}
