import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';
import { View } from '../models/view';
import { Power } from '../models/power';

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

  viewed(userId: number, postId: number): Observable<View> {
    return this.http.post<View>(baseUrl + '/viewed', {userId, postId});
  }

  power(userId: number, postId: number): Observable<any> {
    return this.http.post<any>(baseUrl + '/power', {userId, postId});
  }

  unpower(userId: number, postId: number): Observable<any> {
    return this.http.post<any>(baseUrl + '/unpower', {userId, postId});
  }
}
