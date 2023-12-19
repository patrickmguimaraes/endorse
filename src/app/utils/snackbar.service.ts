import { Injectable, NgZone } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  public loading: boolean = true;

  constructor(private toastr: ToastrService) { }

  success(title: string, texto: string) {
    this.toastr.success(texto, title, {timeOut: 8000, closeButton: true, progressBar: true});
  }

  error(title: string, texto: string) {
    this.toastr.error(texto, title, {timeOut: 8000, closeButton: true, progressBar: true});
  }
}