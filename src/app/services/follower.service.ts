import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Post } from '../models/post';
import { Follower } from '../models/follower';
import { User } from '../models/user.model';

const baseUrl = environment.api + '/followers';

@Injectable({
  providedIn: 'root'
})
export class FollowerService {

  constructor(private http: HttpClient) {}

  follow(data: Follower): Observable<Follower> {
    return this.http.post<Follower>(baseUrl + '/follow', data);
  }

  unfollow(data: Follower): Observable<boolean> {
    return this.http.post<boolean>(baseUrl + '/unfollow', {followerId: data.followerId, follower: data.follower, followed: data.followed, followedId: data.followedId});
  }

  suggests(userId: number, limit: number): Observable<User[]> {
    return this.http.post<User[]>(baseUrl + '/suggests', {userId, limit});
  }

  isFollowing(followerId: number, followedId: number): Observable<Follower> {
    return this.http.post<Follower>(baseUrl + '/isFollowing', {followerId, followedId});
  }
}
