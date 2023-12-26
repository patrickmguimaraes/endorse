import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';
import { View } from '../models/view';
import { Power } from '../models/power';
import { Endorse } from '../models/endorse';
import { Showcase } from '../models/showcase';

const baseUrl = environment.api + '/posts';

interface NewsFeed {
  posts: Post[]
}

@Injectable({
  providedIn: 'root'
})
export class PostService {
  private post$: EventEmitter<Post> = new EventEmitter<Post>();

  constructor(private http: HttpClient) {}

  getPost(userId: number, code: string): Observable<Post> {
    return this.http.post<Post>(baseUrl + '/getPost', {userId:userId, code: code});
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

  saveShowcase(showcase: Showcase): Observable<Showcase> {
    return this.http.post<Showcase>(baseUrl + '/showcase', showcase);
  }

  getNewPost(): Observable<Post | undefined> {
    return this.post$.asObservable();
  }

  addNewPost(post: Post) {
    this.getPost(post.userId, post.link).subscribe(newPost => {
      this.post$.emit(newPost);
    })
  }
}
