import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class LettersService {
  private readonly apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getLetters(): Observable<{ date: string, image: string, text: string }[]> {
    return this.http.get<{ date: string, image: string, text: string }[]>(`${this.apiUrl}/get-letters`);
  }

  addLetter(letter: { date: string, image: string, text: string }): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/add-letter`, letter);
  }
}
