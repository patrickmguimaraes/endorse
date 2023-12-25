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
  posts: Post[]
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

  newsFeed(userId: number, page: number, feedOnlyThisUser: boolean): Observable<Post[]> {
    return this.http.post<Post[]>(baseUrl + '/newsFeed', {userId, page, feedOnlyThisUser});
  }

  viewed(userId: number, postId: number, endorseId: number | null): Observable<View> {
    return this.http.post<View>(baseUrl + '/viewed', {userId, postId, endorseId});
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

  getPostName(userId: number): Observable<{word: string}> {
    return this.http.post<{word: string}>(baseUrl + '/getPostName', {userId});
  }
}
