import { HttpClient } from '@angular/common/http';
import { EventEmitter, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';
import { View } from '../models/view';
import { Power } from '../models/power';
import { Endorse } from '../models/endorse';
import { Showcase } from '../models/showcase';
import { ShowcaseTag } from '../models/showcase-tag';
import { CollaborationTag } from '../models/collaboration-tag.model';
import { Collaboration } from '../models/collaboration.model';
import { CollaborationCategory } from '../models/collaboration-category.model';
import { CollaborationRequest } from '../models/collaboration-request.model';

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

  deleteShowcaseTag(tag: ShowcaseTag): Observable<boolean> {
    return this.http.post<boolean>(baseUrl + '/deleteShowcaseTag', { tag });
  }

  addTag(tag: ShowcaseTag): Observable<ShowcaseTag> {
    return this.http.post<ShowcaseTag>(baseUrl + '/addTag', { tag });
  }

  saveCollaboration(collaboration: Collaboration): Observable<Collaboration> {
    return this.http.post<Collaboration>(baseUrl + '/collaboration', collaboration);
  }

  deleteCollaboration(collaboration: Collaboration): Observable<boolean> {
    return this.http.post<boolean>(baseUrl + '/deleteCollaboration', { collaboration });
  }

  deleteCollaborationSkill(tag: CollaborationTag): Observable<boolean> {
    return this.http.post<boolean>(baseUrl + '/deleteCollaborationSkill', { tag });
  }

  addCollaborationSkill(tag: CollaborationTag): Observable<CollaborationTag> {
    return this.http.post<CollaborationTag>(baseUrl + '/addCollaborationSkill', { tag });
  }

  getAllCollaborationCategories(): Observable<CollaborationCategory[]> {
    return this.http.get<CollaborationCategory[]>(baseUrl + '/getAllCollaborationCategories');
  }

  getNewPost(): Observable<Post | undefined> {
    return this.post$.asObservable();
  }

  addNewPost(post: Post) {
    this.getPost(post.userId, post.link).subscribe(newPost => {
      this.post$.emit(newPost);
    })
  }

  getNumbersPosts(userId: number): Observable<{ideas: number, followers: number, followeds: number}> {
    return this.http.post<{ideas: number, followers: number, followeds: number}>(baseUrl + '/getNumbersPosts', {userId});
  }

  similarCollaborations(collaborationId: number, category: number): Observable<Collaboration[]> {
    return this.http.post<Collaboration[]>(baseUrl + '/similarCollaborations', {collaborationId, category});
  }
  
  applyCollaboration(application: CollaborationRequest): Observable<CollaborationRequest> {
    return this.http.post<CollaborationRequest>(baseUrl + '/applyCollaboration', {application});
  }

  changeCollaborationRequestStatus(collaborationRequestId: number, status: string): Observable<boolean> {
    return this.http.post<boolean>(baseUrl + '/changeCollaborationRequestStatus', {collaborationRequestId, status});
  }
}
