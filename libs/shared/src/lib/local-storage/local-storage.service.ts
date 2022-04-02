import { Inject, Injectable } from '@angular/core';
import { LOCAL_STORAGE } from './local-storage.token';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  constructor(@Inject(LOCAL_STORAGE) private readonly localStorage: Storage) {}

  setItem(key: string, value: string) {
    this.localStorage.setItem(key, value);
  }

  getItem(key: string): string | null {
    return this.localStorage.getItem(key);
  }

  removeItem(key: string) {
    this.localStorage.removeItem(key);
  }
}
