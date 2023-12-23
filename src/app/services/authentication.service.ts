import { AfterViewInit, Inject, Injectable, NgZone } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { User } from '../models/user.model';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import * as CryptoJS from "crypto-js";
import { catchError, pluck, tap } from 'rxjs/operators';
import { Chat } from '../models/chat.model';
import { ReloadComponent } from '../pages/reload/reload.component';
import { environment } from '../../environments/environment';
import { DOCUMENT } from '@angular/common';

interface AuthResponse {
  tokens: string;
  user: User;
  code: number;
  message: string;
  chats: Array<Chat>;
}

@Injectable({
  providedIn: 'root',
})
export class AuthenticationService {
  private user$ = new BehaviorSubject<User | null | undefined>(undefined);
  private userPicture$ = new BehaviorSubject<string>(environment.serverOrigin + "/files/users/undefined/profile.png");
  uid: number;
  user?: User | null;

  constructor(public router:Router, private http: HttpClient) {
    
  }

  loginSessao(user: User, rememberMe: boolean) {
    if (rememberMe) {
      this.alterarSessao(user);
    }
    else {
      this.uid = user.id;
    }
  }

  cleanSessao() {
    this.setSessao({});
  }

  getSessao(): any {
    var sessao = JSON.parse(localStorage.getItem('endorse') as string) ? JSON.parse(localStorage.getItem('endorse') as string) : null;

    if ((sessao && sessao.uid)) {
      var bytes = CryptoJS.AES.decrypt(sessao.uid, environment.encrypitKey);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      sessao.uid = originalText;
    }
    else if (this.uid) {
      if (!sessao) { sessao = {}; }
      sessao.uid = this.uid;
    }

    return sessao;
  }

  private setSessao(object: any) {
    localStorage.setItem('endorse', JSON.stringify(object));
  }

  alterarSessao(user: any) {
    var sessao = localStorage!.getItem('endorse') == null ? new Object : JSON.parse(localStorage!.getItem('endorse') as string);
    var ciphertext = CryptoJS.AES.encrypt(user.uid, environment.encrypitKey).toString();

    sessao.uid = ciphertext;

    localStorage.setItem('endorse', JSON.stringify(sessao));
  }

  remove() {
    localStorage.removeItem('endorse');
  }

  logout() {
    var sessao = this.getSessao();
    var novaSessao: any = {};
    novaSessao.language = sessao.language;
    this.setSessao(novaSessao);
    this.setUser(null);
    //this.mensagemService.logout();
  }

  private addTokens(tokens: any) {
    var sessao: any = this.getSessao();
    if (!sessao) { sessao = {}; }
    sessao.tokens = tokens;
    this.setSessao(sessao);
    //this.socket.setUsuario(this.user);
  }

  getNewRefreshToken() {
    return this.http.post<AuthResponse>(environment.api + '/auth/refresh-tokens', { token: this.getAccessToken(), refreshToken: this.getRefreshToken() })
      .pipe(
        tap((tokens: any) => {
          if (tokens && tokens != "") { this.addTokens(tokens); }
        }),
        pluck('tokens')
      );
  }

  getTokens() {
    return (this.getSessao() ? this.getSessao().tokens : '');
  }

  getRefreshToken() {
    return (this.getSessao() && this.getSessao().tokens && this.getSessao().tokens.refresh ? this.getSessao().tokens.refresh.token : null);
  }

  getAccessToken() {
    return (this.getSessao() && this.getSessao().tokens && this.getSessao().tokens.access ? this.getSessao().tokens.access.token : null);
  }

  getAuthorizationHeaders() {
    const token: string | null = this.getAccessToken() || '';
    return { Authorization: `Bearer ${token}` };
  }

  login(username: string, password: string): Observable<User> {
    return this.http
      .post<AuthResponse>(environment.api + '/auth/login', { email: username, password })
      .pipe(
        tap(({ tokens, user, chats }) => {
          if (user && user.isEmailVerified) {
            this.setUser(user);
            this.addTokens(tokens);
            //this.mensagemService.init(user, chats);
          }
        }),
        pluck('user')
      );
  }

  register(user: User): Observable<User> {
    try {
      return this.http.post<User>(environment.api + '/auth/register', user);
    } catch (error: any) {
      return error;
    }
  }

  update(user: User): Observable<AuthResponse | any> {
    try {
      return this.http.patch<AuthResponse>(environment.api + '/users/' + user.id, user);
    } catch (error: any) {
      return error;
    }
  }

  private setUser(user: User | null | undefined): void {
    this.user = user;
    this.user$.next(user);
    this.setProfilePicture(environment.serverOrigin + "/files/users/" + this.user?.id + "/profile.png")
  }

  getUser(): Observable<User | null | undefined> {
    return this.user$.asObservable();
  }

  isLogged(): Promise<boolean> {
    return new Promise((resolve, reject) => {
      this.getUser().subscribe((user) => {
        resolve(user!=null && user!=undefined)
      })
    })
  }

  getUserPicture(): Observable<string> {
    return this.userPicture$.asObservable();
  }

  setProfilePicture(picture: string) {
    this.userPicture$.next(picture);
  }

  sendPasswordResetEmail() {
    
  }

  verifyEmail(token: string) {
    return this.http.get<boolean>(environment.api + '/auth/verify-email?token=' + token);
  }

  me(): Observable<User | null | undefined> {
    var token = this.getAccessToken();
    
    if (token) {
      return this.http.post<AuthResponse>(environment.api + '/auth/me', { token: token }).pipe(
        tap(({ user, chats }) => {
          this.setUser(user);
          //this.socket.setUsuario(user);
          //this.mensagemService.init(user, chats);
        }),
        pluck('user'),
        catchError(() => {
          this.setUser(null);
          return of(null)
        } )
      );
    }
    else {
      this.setUser(null);
      return of(null);
    }
  }

  /**
   * Let's try to get user's information if he was logged in previously,
   * thus we can ensure that the user is able to access the `/` (home) page.
   */
  checkTheUserOnTheFirstLoad(): Promise<User | null | undefined> {
    return this.me().toPromise();
  }
}