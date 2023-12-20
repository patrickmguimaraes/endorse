import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { ActivationDate } from '../models/activation-date.model';
import { GeograficScope } from '../models/geografic-scope.model';
import { MediaChannel } from '../models/media-channel.model';
import { ContentElement } from '../models/content-element.model';
import { ComplianceMeasure } from '../models/compliance-measure.model';
import { Metric } from '../models/metric.model';
import { Request } from '../models/request.model';
import { RequestHistory } from '../models/request-history.model';

const baseUrl = environment.api + '/requests';
const baseUrlActivationDate = environment.api + '/activationDates';
const baseUrlGeograficScope = environment.api + '/geograficScopes';
const baseUrlMediaChannel = environment.api + '/mediaChannels';
const baseUrlContentElement = environment.api + '/contentElements';
const baseUrlComplianceMeasure = environment.api + '/complianceMeasures';
const baseUrlMetric = environment.api + '/metrics';
const baseUrlHistory = environment.api + '/requestHistory';

@Injectable({
  providedIn: 'root'
})
export class RequestService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Request[]> {
    return this.http.get<Request[]>(baseUrl);
  }

  get(id: any): Observable<Request> {
    return this.http.get<Request>(`${baseUrl}/${id}`);
  }

  create(data: Request): Observable<Request> {
    return this.http.post<Request>(baseUrl, data);
  }

  update(id: any, data: Request): Observable<Request> {
    return this.http.put<Request>(`${baseUrl}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  findByName(title: any): Observable<Request[]> {
    return this.http.get<Request[]>(`${baseUrl}?name=${title}`);
  }

  attachFile(file: FormData): Observable<any> {
    return this.http.post<any>(`${baseUrl}/attachFile`, file);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ActivationDateService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<ActivationDate[]> {
    return this.http.get<ActivationDate[]>(baseUrlActivationDate);
  }

  get(id: any): Observable<ActivationDate> {
    return this.http.get<ActivationDate>(`${baseUrlActivationDate}/${id}`);
  }

  create(data: ActivationDate): Observable<ActivationDate> {
    return this.http.post<ActivationDate>(baseUrlActivationDate, data);
  }

  update(id: any, data: ActivationDate): Observable<ActivationDate> {
    return this.http.put<ActivationDate>(`${baseUrlActivationDate}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrlActivationDate}/${id}`);
  }

  findByName(title: any): Observable<ActivationDate[]> {
    return this.http.get<ActivationDate[]>(`${baseUrlActivationDate}?name=${title}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class GeograficScopeService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<GeograficScope[]> {
    return this.http.get<GeograficScope[]>(baseUrlGeograficScope);
  }

  get(id: any): Observable<GeograficScope> {
    return this.http.get<GeograficScope>(`${baseUrlGeograficScope}/${id}`);
  }

  create(data: GeograficScope): Observable<GeograficScope> {
    return this.http.post<GeograficScope>(baseUrlGeograficScope, data);
  }

  update(id: any, data: GeograficScope): Observable<GeograficScope> {
    return this.http.put<GeograficScope>(`${baseUrlGeograficScope}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrlGeograficScope}/${id}`);
  }

  findByName(title: any): Observable<GeograficScope[]> {
    return this.http.get<GeograficScope[]>(`${baseUrlGeograficScope}?name=${title}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MediaChannelService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<MediaChannel[]> {
    return this.http.get<MediaChannel[]>(baseUrlMediaChannel);
  }

  get(id: any): Observable<MediaChannel> {
    return this.http.get<MediaChannel>(`${baseUrlMediaChannel}/${id}`);
  }

  create(data: MediaChannel): Observable<MediaChannel> {
    return this.http.post<MediaChannel>(baseUrlMediaChannel, data);
  }

  update(id: any, data: MediaChannel): Observable<MediaChannel> {
    return this.http.put<MediaChannel>(`${baseUrlMediaChannel}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrlMediaChannel}/${id}`);
  }

  findByName(title: any): Observable<MediaChannel[]> {
    return this.http.get<MediaChannel[]>(`${baseUrlMediaChannel}?name=${title}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ContentElementService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<ContentElement[]> {
    return this.http.get<ContentElement[]>(baseUrlContentElement);
  }

  get(id: any): Observable<ContentElement> {
    return this.http.get<ContentElement>(`${baseUrlContentElement}/${id}`);
  }

  create(data: ContentElement): Observable<ContentElement> {
    return this.http.post<ContentElement>(baseUrlContentElement, data);
  }

  update(id: any, data: ContentElement): Observable<ContentElement> {
    return this.http.put<ContentElement>(`${baseUrlContentElement}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrlContentElement}/${id}`);
  }

  findByName(title: any): Observable<ContentElement[]> {
    return this.http.get<ContentElement[]>(`${baseUrlContentElement}?name=${title}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class ComplianceMeasureService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<ComplianceMeasure[]> {
    return this.http.get<ComplianceMeasure[]>(baseUrlComplianceMeasure);
  }

  get(id: any): Observable<ComplianceMeasure> {
    return this.http.get<ComplianceMeasure>(`${baseUrlComplianceMeasure}/${id}`);
  }

  create(data: ComplianceMeasure): Observable<ComplianceMeasure> {
    return this.http.post<ComplianceMeasure>(baseUrlComplianceMeasure, data);
  }

  update(id: any, data: ComplianceMeasure): Observable<ComplianceMeasure> {
    return this.http.put<ComplianceMeasure>(`${baseUrlComplianceMeasure}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrlComplianceMeasure}/${id}`);
  }

  findByName(title: any): Observable<ComplianceMeasure[]> {
    return this.http.get<ComplianceMeasure[]>(`${baseUrlComplianceMeasure}?name=${title}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class MetricService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<Metric[]> {
    return this.http.get<Metric[]>(baseUrlMetric);
  }

  get(id: any): Observable<Metric> {
    return this.http.get<Metric>(`${baseUrlMetric}/${id}`);
  }

  create(data: Metric): Observable<Metric> {
    return this.http.post<Metric>(baseUrlMetric, data);
  }

  update(id: any, data: Metric): Observable<Metric> {
    return this.http.put<Metric>(`${baseUrlMetric}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrlMetric}/${id}`);
  }

  findByName(title: any): Observable<Metric[]> {
    return this.http.get<Metric[]>(`${baseUrlMetric}?name=${title}`);
  }
}

@Injectable({
  providedIn: 'root'
})
export class RequestHistoryService {

  constructor(private http: HttpClient) {}

  getAll(): Observable<RequestHistory[]> {
    return this.http.get<RequestHistory[]>(baseUrlHistory);
  }

  get(id: any): Observable<RequestHistory> {
    return this.http.get<RequestHistory>(`${baseUrlHistory}/${id}`);
  }

  create(data: RequestHistory): Observable<RequestHistory> {
    return this.http.post<RequestHistory>(baseUrlHistory, data);
  }

  update(id: any, data: RequestHistory): Observable<RequestHistory> {
    return this.http.put<RequestHistory>(`${baseUrlHistory}/${id}`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrlHistory}/${id}`);
  }

  mountMyHistory(userId: number): Observable<RequestHistory[]> {
    return this.http.get<RequestHistory[]>(`${baseUrlHistory}/mountMyHistory/${userId}`);
  }
}
