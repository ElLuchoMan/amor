// src/app/services/songs.service.ts

import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostToken } from '../models/token.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  public token = '';
  private readonly apiUrl = environment.apiUrl;
  private readonly storageKey = 'user-uuid';

  constructor(private http: HttpClient) { }

  listSongs(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-songs`);
  }

  listText(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-text`);
  }

  listResources(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/get-resources`);
  }

  postToken(token: PostToken): Observable<PostToken> {
    return this.http.post<PostToken>(`${this.apiUrl}/update-token`, token);
  }

  getToken(user_id: string): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(`${this.apiUrl}/get-token`, { params: { user_id } });
  }

  generateUUID(): string {
    return '16032024-xxxx-xxx-xx-x'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }

  getUUID(): string {
    let uuid = localStorage.getItem(this.storageKey);
    if (!uuid) {
      uuid = this.generateUUID();
      localStorage.setItem(this.storageKey, uuid);
    }
    return uuid;
  }
}
