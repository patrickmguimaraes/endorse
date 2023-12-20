import { HttpClient } from '@angular/common/http';
import { Pipe, PipeTransform } from '@angular/core';
import { Observable, switchMap } from 'rxjs';

@Pipe({
  name: 'image',
  standalone: true
})
export class ImagePipe implements PipeTransform {

  constructor(private http: HttpClient) { }

  transform(url: string) {
    if(!url || url.startsWith("https")) {
      return Observable.create((observer: { next: (arg0: string | ArrayBuffer | null) => void; }) => {
        observer.next(url);
      })
    }
    else {
      return this.http.get(url, { responseType: "blob" }).pipe(switchMap(blob => {
        return Observable.create((observer: { next: (arg0: string | ArrayBuffer | null) => void; }) => {
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = function () {
            observer.next(reader.result);
          }
        })
      }))
    }
  }
}
