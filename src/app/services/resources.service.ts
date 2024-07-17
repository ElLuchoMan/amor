import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResourcesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  listResources(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-resources`);
  }

  getUrlByType(data: any[], type: string): string {
    const resource = data.find(item => item.type === type);
    return resource ? resource.url : '';
  }
}
