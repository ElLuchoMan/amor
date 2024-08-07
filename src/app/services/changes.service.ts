import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ChangesService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getChanges(): Observable<string[]> {
    return this.http.get<string[]>(`${this.apiUrl}/get-changes`);
  }
}
