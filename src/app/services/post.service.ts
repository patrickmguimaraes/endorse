import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';

const baseUrl = environment.api + '/posts';

interface NewsFeed {
  rows: Array<Post>;
  count: number;
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {}

  create(data: Post): Observable<Post> {
    return this.http.post<Post>(baseUrl + '/post', data);
  }

  newsFeed(userId: number, page: number, pageSize: number): Observable<NewsFeed> {
    return this.http.post<NewsFeed>(baseUrl + '/newsFeed', {userId, page, pageSize});
  }
}
