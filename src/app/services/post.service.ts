import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';
import { View } from '../models/view';
import { Power } from '../models/power';
import { Endorse } from '../models/endorse';

const baseUrl = environment.api + '/posts';

interface NewsFeed {
  endorsements: {
    rows: Endorse[];
    count: number;
  },
  posts: {
    rows: Post[];
    count: number;
  }
}

@Injectable({
  providedIn: 'root'
})
export class PostService {

  constructor(private http: HttpClient) {}

  getPost(code: string): Observable<Post> {
    return this.http.post<Post>(baseUrl + '/getPost', {code: code});
  }

  create(data: Post): Observable<Post> {
    return this.http.post<Post>(baseUrl + '/post', data);
  }

  newsFeed(userId: number): Observable<NewsFeed> {
    return this.http.post<NewsFeed>(baseUrl + '/newsFeed', {userId});
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

  endorse(endorse: Endorse): Observable<Endorse> {
    return this.http.post<Endorse>(baseUrl + '/endorse', endorse);
  }

  poweredAndEndorsed(userId: number, postId: number): Observable<{power: Power, endorse: Endorse}> {
    return this.http.post<{power: Power, endorse: Endorse}>(baseUrl + '/poweredAndEndorsed', {userId, postId});
  }
}
