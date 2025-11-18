import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Book {
  id: string;
  title: string;
  authors: string[];
  publishedDate: string;
  description: string;
  thumbnail: string;
  previewLink: string;
  infoLink: string;
  pageCount: number;
  categories: string[];
  language: string;
  averageRating?: number;
  ratingsCount?: number;
  publisher?: string;
  publishedDateFull?: string;
  industryIdentifiers?: Array<{ type: string; identifier: string }>;
  subtitle?: string;
  narrator?: string;
  duration?: string;
  format?: string;
}

export interface BooksResponse {
  items: Book[];
  totalItems: number;
}

@Injectable({
  providedIn: 'root'
})
export class GoogleBooksService {
  private apiUrl = 'https://www.googleapis.com/books/v1/volumes';

  constructor(private http: HttpClient) {}

  searchBooks(query: string, maxResults: number = 20): Observable<BooksResponse> {
    const params = new HttpParams()
      .set('q', query)
      .set('maxResults', maxResults.toString())
      .set('orderBy', 'relevance');

    return this.http.get<any>(this.apiUrl, { params }).pipe(
      map(response => ({
        items: (response.items || []).map((item: any) => this.mapBook(item)),
        totalItems: response.totalItems || 0
      }))
    );
  }

  getBookById(id: string): Observable<Book> {
    return this.http.get<any>(`${this.apiUrl}/${id}`).pipe(
      map(item => this.mapBook(item))
    );
  }

  private mapBook(item: any): Book {
    const volumeInfo = item.volumeInfo || {};
    const imageLinks = volumeInfo.imageLinks || {};
    
    return {
      id: item.id,
      title: volumeInfo.title || 'Sin título',
      authors: volumeInfo.authors || ['Autor desconocido'],
      publishedDate: volumeInfo.publishedDate || '',
      publishedDateFull: volumeInfo.publishedDate || '',
      description: volumeInfo.description || 'Sin descripción disponible.',
      thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail || '/assets/no-cover.png',
      previewLink: volumeInfo.previewLink || '',
      infoLink: volumeInfo.infoLink || '',
      pageCount: volumeInfo.pageCount || 0,
      categories: volumeInfo.categories || [],
      language: volumeInfo.language || 'es',
      averageRating: volumeInfo.averageRating || 0,
      ratingsCount: volumeInfo.ratingsCount || 0,
      publisher: volumeInfo.publisher || '',
      industryIdentifiers: volumeInfo.industryIdentifiers || [],
      subtitle: volumeInfo.subtitle || ''
    };
  }
}

