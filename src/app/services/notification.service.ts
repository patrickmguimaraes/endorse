import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notification } from '../models/notification.model';

const baseUrl = environment.api + '/notifications';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  constructor(private http: HttpClient) { }

  getNewNotifications(): Observable<Notification[]> {
    return this.http.get<Notification[]>(`${baseUrl}/getNewNotifications`);
  }

  markRead(notificationsIds: Array<number>): Observable<any> {
    return this.http.post<any>(`${baseUrl}/markRead`, { notificationsIds });
  }
}