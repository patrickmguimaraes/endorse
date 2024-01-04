import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { File } from '../models/file.model';
import { Showcase } from '../models/showcase';

const baseUrl = environment.api + '/files';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor(private http: HttpClient) { }

  savePostImage(form: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/savePostImage`, form);
  }

  savePostVideo(form: any): Observable<any> {
    return this.http.post<any>(`${baseUrl}/savePostVideo`, form);
  }

  getPrivateFile(caminho: string): string {
    caminho = caminho.startsWith("storage") ? caminho.substring("storage".length + 1) : caminho;
    return environment.origin + caminho;
  }

  attachShowcaseFile(file: FormData, postId: number, showcaseId: number): Observable<any> {
    return this.http.post<any>(`${baseUrl}/attachShowcaseFile/${postId}&${showcaseId}`, file);
  }

  deleteShowcaseFile(showcase: Showcase, file: File): Observable<any> {
    return this.http.post<any>(`${baseUrl}/deleteShowcaseFile`, { showcase, file });
  }

  saveCurriculum(form: any, postId: number, collaborationId: number): Observable<any> {
    return this.http.post<any>(`${baseUrl}/saveCurriculum/${postId}&${collaborationId}`, form);
  }

  attachFileCopyright(postId: number, file: FormData): Observable<any> {
    return this.http.post<any>(`${baseUrl}/attachFileCopyright/${postId}`, file);
  }
}