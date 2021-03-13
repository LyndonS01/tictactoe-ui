import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor() {}

  storeValue(key: string, value: any): void {
    localStorage.setItem(key, JSON.stringify(value));
  }

  getValue(key: string): any {
    const item = localStorage.getItem(key);
    if (item === null) {
      return null;
    } else {
      return JSON.parse(item);
    }
  }

  removeValue(key: string): void {
    localStorage.removeItem(key);
  }
}
