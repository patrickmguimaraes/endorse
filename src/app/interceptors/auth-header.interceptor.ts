import {
  HttpRequest,
  HttpInterceptorFn,
  HttpHandlerFn,
} from '@angular/common/http';
import { environment } from '../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn) => {
  if(req.url.startsWith(environment.serverOrigin)) {
    var sessao = JSON.parse(localStorage.getItem('endorse') as string) ? JSON.parse(localStorage.getItem('endorse') as string) : null;

    if ((sessao && sessao.uid)) {
      var bytes = CryptoJS.AES.decrypt(sessao.uid, environment.encrypitKey);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      sessao.uid = originalText;
      const token = sessao.tokens.access.token;
      const header = { Authorization: `Bearer ${token}` };

      req = req.clone({
        setHeaders: header
      });

      return next(req);
    }
  }

  return next(req);
}