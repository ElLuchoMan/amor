import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  private readonly url = 'https://api.jsonstorage.net/v1/json/6426abfb-bbae-43e1-94d8-70c6cbb1554e/3c955013-acd4-4290-99a9-621ecf24b868';

  public tokenFCM: string[] = [];

  private readonly http = inject(HttpClient);

  listSongs() {
    console.log(this.tokenFCM);
    return this.http.get(this.url);
  }

  addToken(token: string) {
    this.tokenFCM.push(token);
  }
}
