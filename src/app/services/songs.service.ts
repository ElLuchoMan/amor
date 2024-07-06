import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PostToken } from '../models/token.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  public token = '';
  private readonly jsonUrl = environment.jsonUrl;
  private readonly apiUrl = environment.apiUrl;
  private readonly storageKey = 'user-uuid';


  constructor(private http: HttpClient) { }

  listSongs() {
    return this.http.get(this.jsonUrl);
  }

  postToken(token: PostToken): Observable<PostToken> {
    console.log('TOKEN', token)
    return this.http.post<PostToken>(this.apiUrl + '/update-token', token);
  }

  getToken(user_id: string): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(`${this.apiUrl}/get-token/${user_id}`);
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
