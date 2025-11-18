import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Book } from './google-books.service';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private readonly FAVORITES_KEY = 'favorites';
  private favorites: Map<string, Book> = new Map();

  constructor(private storage: StorageService) {
    this.loadFavorites();
  }

  private loadFavorites(): void {
    const savedFavorites = this.storage.getItem<Record<string, Book>>(this.FAVORITES_KEY);
    if (savedFavorites) {
      this.favorites = new Map(Object.entries(savedFavorites));
    }
  }

  private saveFavorites(): void {
    const favoritesObj = Object.fromEntries(this.favorites);
    this.storage.setItem(this.FAVORITES_KEY, favoritesObj);
  }

  addToFavorites(book: Book, userId: string): Observable<{ success: boolean; message: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const key = `${userId}_${book.id}`;
        if (this.favorites.has(key)) {
          observer.next({ success: false, message: 'El libro ya está en favoritos' });
        } else {
          this.favorites.set(key, book);
          this.saveFavorites();
          observer.next({ success: true, message: 'Libro añadido a favoritos' });
        }
        observer.complete();
      }, 300);
    });
  }

  removeFromFavorites(bookId: string, userId: string): Observable<{ success: boolean }> {
    return new Observable(observer => {
      setTimeout(() => {
        const key = `${userId}_${bookId}`;
        this.favorites.delete(key);
        this.saveFavorites();
        observer.next({ success: true });
        observer.complete();
      }, 300);
    });
  }

  getUserFavorites(userId: string): Observable<Book[]> {
    const userFavorites: Book[] = [];
    this.favorites.forEach((book, key) => {
      if (key.startsWith(`${userId}_`)) {
        userFavorites.push(book);
      }
    });
    return of(userFavorites).pipe(delay(300));
  }

  isFavorite(bookId: string, userId: string): boolean {
    const key = `${userId}_${bookId}`;
    return this.favorites.has(key);
  }
}

