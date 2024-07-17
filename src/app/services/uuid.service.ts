// src/app/services/uuid.service.ts

import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UUIDService {
  private readonly storageKey = 'user-uuid';

  generateUUID(): string {
    return '16032024-xxxx-xxx-xx-x'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : ((r & 0x3) | 0x8);
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
