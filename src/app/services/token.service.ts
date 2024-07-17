import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PostToken } from '../models/token.model';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class TokenService {
  public token = '';
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  postToken(token: PostToken): Observable<PostToken> {
    return this.http.post<PostToken>(`${this.apiUrl}/update-token`, token);
  }

  getToken(user_id: string): Observable<{ token: string }> {
    return this.http.get<{ token: string }>(`${this.apiUrl}/get-token`, { params: { user_id } });
  }
}
