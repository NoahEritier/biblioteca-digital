import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../services/google-books.service';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-card.component.html',
  styleUrl: './book-card.component.css'
})
export class BookCardComponent {
  @Input() book!: Book;
  @Output() cardClick = new EventEmitter<Book>();

  defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzhCNkY0NyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRjVFNkQzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gUG9ydGFkYTwvdGV4dD48L3N2Zz4=';

  getAuthors(): string {
    return this.book?.authors?.join(', ') || 'Autor desconocido';
  }

  getYear(): string {
    if (!this.book?.publishedDate) return '';
    const year = this.book.publishedDate.split('-')[0];
    return year || '';
  }

  getRating(): number {
    return this.book?.averageRating || 0;
  }

  getRatingCount(): number {
    return this.book?.ratingsCount || 0;
  }

  onCardClick(): void {
    if (this.book) {
      this.cardClick.emit(this.book);
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.defaultImage;
    }
  }

  getStars(): number[] {
    const rating = Math.round(this.getRating());
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }
}

