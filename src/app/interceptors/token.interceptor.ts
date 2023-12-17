import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpResponse,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError, filter, take, switchMap, tap, finalize, last } from "rxjs/operators";
import { EMPTY } from 'rxjs';
import { AuthenticationService } from '../services/authentication.service';
import { SnackbarService } from '../utils/snackbar.service';
import { AppComponent } from '../app.component';
 
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  private refreshTokenSubject: BehaviorSubject<any> = new BehaviorSubject<any>(null);

  constructor(private snackBar: SnackbarService, private auth: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.getAccessToken()) {
      request = this.addToken(request, this.auth.getAccessToken());
    } 

    return next.handle(request).pipe(
      catchError((error) => {
        this.snackBar.loading = false;
        
        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else {
          this.showSnackBar(error);
          return throwError(error);
        }
      })
    );
  }

  private addToken(request: HttpRequest<any>, token: string) {
    return request.clone({
      setHeaders: {
        Authorization: `Bearer ${token}`,
      },
    });
  }

  private handle401Error(request: HttpRequest<any>, next: HttpHandler) {
    if (!this.isRefreshing) {
      this.isRefreshing = true;
      this.refreshTokenSubject.next(null);

      return this.auth.getNewRefreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          this.refreshTokenSubject.next(token['result'].accessToken);
          return next.handle(this.addToken(request, token['result'].accessToken));
        })
      );
    } else {
      return this.refreshTokenSubject.pipe(
        filter((token) => token != null),
        take(1),
        switchMap((jwt) => {
          return next.handle(this.addToken(request, jwt));
        })
      );
    }
  }

  private showSnackBar(response: any) {
    var text: string | null = response?.error?.message ?? response?.error?.statusText;
    if (text) { this.snackBar.error("Error", text); }
  };
}

export const tokenInterceptor = {
  provide: HTTP_INTERCEPTORS,
  useClass: TokenInterceptor,
  multi: true
};