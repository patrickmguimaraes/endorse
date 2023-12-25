import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
  HttpErrorResponse,
  HTTP_INTERCEPTORS,
} from '@angular/common/http';

import { Observable, BehaviorSubject, throwError } from "rxjs";
import { catchError, filter, take, switchMap, tap, finalize, last } from "rxjs/operators";
import { AuthenticationService } from '../services/authentication.service';
import { SnackbarService } from '../utils/snackbar.service';
 
@Injectable({
  providedIn: 'root'
})
export class TokenInterceptor implements HttpInterceptor {
  private isRefreshing = false;
  
  constructor(private snackBar: SnackbarService, private auth: AuthenticationService) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    if (this.auth.getAccessToken()) {
      request = this.addToken(request, this.auth.getAccessToken());
    } 

    return next.handle(request).pipe(
      catchError((error) => {
        this.snackBar.loading = false;
        var text: string | null = error?.error?.message ?? error?.error?.statusText;

        if (error instanceof HttpErrorResponse && error.status === 401) {
          return this.handle401Error(request, next);
        } else if(text=="Token not found" || text=="jwt expired") {
          return this.handle401Error(request, next);
        }
        else {
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
      
      return this.auth.getNewRefreshToken().pipe(
        switchMap((token: any) => {
          this.isRefreshing = false;
          return next.handle(this.addToken(request, this.auth.getAccessToken()));
        })
      );
    } else {
      return next.handle(this.addToken(request, this.auth.getAccessToken()));
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