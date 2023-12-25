import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LocationService {
  ip: any;

  constructor(private httpClient: HttpClient) {

  }

  ngOnInit(): void {
    // this.getIpAddress().subscribe((ip: any) => {
    //   this.ip = ip["ip"];
    // });
  }

  getLanguage() {
    if(this.getSessao()!=null && this.getSessao().language && this.getSessao().country && this.getSessao().dateFormat) {
      var subject = new BehaviorSubject<String>(this.getSessao().language as String);
      return subject.asObservable();
    }
    else {
      var subject = new BehaviorSubject<String>("");
      var observable = subject.asObservable();
      
      this.getIpAddress().subscribe((res: any) => {
        this.ip = res['ip'];

        this.getGEOLocation(this.ip).subscribe((res: any) => {
          //this.latitude = res['latitude'];
          //this.longitude = res['longitude'];
          //this.currency = res['currency']['code'];
          //this.currencysymbol = res['currency']['symbol'];
          //this.city = res['city'];
          //this.isp = res['isp'];
          
          var language = this.getLanguageCode(res['location'].country as string);
          var sessao = this.getSessao();
          if(!sessao) { sessao = {}; }
          sessao.language = language;
          sessao.country = res['location'].country as string;
          sessao.dateFormat = this.getDateTime(res['location'].country as string);
          this.setSessao(sessao);
          subject.next(language);
        });
      });

      return observable;
    }
  }

  getIpAddress() {
    return this.httpClient
      .get('https://api.ipify.org?format=json')
      .pipe(
        catchError(this.handleError)
      );
  }

  getGEOLocation(ip: string) {
    let url = "https://geo.ipify.org/api/v2/country,city?apiKey=at_ORA2KxyKvFqQGvx0iXd2SIvw8c6HY&ipAddress=" + ip;
    return this.httpClient
      .get(url)
      .pipe(
        catchError(this.handleError)
      );
  }

  private getLanguageCode(country: string) {
    switch (country) {
      case 'BR':
        return 'pt';
      case 'US':
        return 'en';
      default:
        return 'pt';
    }
  }

  private handleError(error: HttpErrorResponse) {
    if (error.error instanceof ErrorEvent) {
      // A client-side or network error occurred. Handle it accordingly.
      console.error('An error occurred:', error.error.message);
    } else {
      // The backend returned an unsuccessful response code.
      // The response body may contain clues as to what went wrong,
      console.error(
        `Backend returned code ${error.status}, ` +
        `body was: ${error.error}`);
    }
    // return an observable with a user-facing error message
    return throwError(
      'Something bad happened; please try again later.');
  }

  getSessao(): any {
    var sessao = JSON.parse(localStorage.getItem('endorse') as string) ? JSON.parse(localStorage.getItem('endorse') as string) : null;

    if ((sessao && sessao.uid)) {
      var bytes = CryptoJS.AES.decrypt(sessao.uid, environment.encrypitKey);
      var originalText = bytes.toString(CryptoJS.enc.Utf8);
      sessao.uid = originalText;
    }

    return sessao;
  }

  setSessao(object: any) {
    localStorage.setItem('endorse', JSON.stringify(object));
  }

  getDateTime(locale: string) {
    const options: Intl.DateTimeFormatOptions = {
      hour: "numeric",
      minute: "numeric",
      second: "numeric",
      day: "numeric",
      month: "numeric",
      year: "numeric",
    };
  
    const formatObj = new Intl.DateTimeFormat(locale, options).formatToParts(
      Date.now()
    );
  
    return formatObj.map((obj) => {
        switch (obj.type) {
          case "hour":
            return "HH";
          case "minute":
            return "MM";
          case "second":
            return "SS";
          case "day":
            return "DD";
          case "month":
            return "MM";
          case "year":
            return "YYYY";
          default:
            return obj.value;
        }
      })
      .join("");
  }
}