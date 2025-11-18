import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { StorageService } from './storage.service';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class UserProfileService {
  private readonly PROFILES_KEY = 'userProfiles';

  constructor(
    private storage: StorageService,
    private authService: AuthService
  ) {}

  getUserProfile(): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          observer.next(null);
          observer.complete();
          return;
        }

        const profiles = this.storage.getItem<Record<string, any>>(this.PROFILES_KEY) || {};
        const profile = profiles[currentUser.id] || null;
        observer.next(profile);
        observer.complete();
      }, 300);
    });
  }

  updateUserProfile(user: any): Observable<any> {
    return new Observable(observer => {
      setTimeout(() => {
        const currentUser = this.authService.getCurrentUser();
        if (!currentUser) {
          observer.error('Usuario no autenticado');
          return;
        }

        const profiles = this.storage.getItem<Record<string, any>>(this.PROFILES_KEY) || {};
        profiles[currentUser.id] = user;
        this.storage.setItem(this.PROFILES_KEY, profiles);
        
        observer.next(user);
        observer.complete();
      }, 300);
    });
  }

  updateAvatar(avatar: File): Observable<string> {
    return new Observable(observer => {
      setTimeout(() => {
        const url = URL.createObjectURL(avatar);
        observer.next(url);
        observer.complete();
      }, 500);
    });
  }
}

