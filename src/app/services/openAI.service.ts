import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';

const baseUrl = environment.api + '/openAI';

@Injectable({
  providedIn: 'root'
})
export class OpenAIService {

  constructor(private http: HttpClient) {}

  generateRequest(prompt: string): Observable<any> {
    return this.http.post<any>(`${baseUrl}/generateRequest`, {prompt});
  }
}
