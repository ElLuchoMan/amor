import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SongsService {
  public token = '';
  private readonly url = 'https://api.jsonstorage.net/v1/json/6426abfb-bbae-43e1-94d8-70c6cbb1554e/3c955013-acd4-4290-99a9-621ecf24b868';


  private readonly http = inject(HttpClient);

  listSongs() {
    return this.http.get(this.url);
  }
}
