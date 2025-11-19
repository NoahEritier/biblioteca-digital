import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleBooksService, Book } from '../../services/google-books.service';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { BookDetailPanelComponent } from '../../components/book-detail-panel/book-detail-panel.component';
import { SearchBarComponent } from '../../components/search-bar/search-bar.component';
import { CategoryFilterComponent } from '../../components/category-filter/category-filter.component';

@Component({
  selector: 'app-catalogo',
  standalone: true,
  imports: [CommonModule, BookCardComponent, BookDetailPanelComponent, SearchBarComponent, CategoryFilterComponent],
  templateUrl: './catalogo.component.html',
  styleUrl: './catalogo.component.css'
})
export class CatalogoComponent implements OnInit {
  books: Book[] = [];
  filteredBooks: Book[] = [];
  loading: boolean = false;
  error: string | null = null;
  selectedBook: Book | null = null;
  isPanelOpen: boolean = false;
  selectedCategory: string = '';
  categories: string[] = [];

  constructor(private booksService: GoogleBooksService) {}

  ngOnInit(): void {
    this.searchBooks('best sellers');
  }

  onSearch(query: string): void {
    this.searchBooks(query);
  }

  searchBooks(query: string): void {
    this.loading = true;
    this.error = null;
    this.books = [];
    this.filteredBooks = [];

    this.booksService.searchBooks(query, 40).subscribe({
      next: (response) => {
        this.books = response.items;
        this.extractCategories();
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        this.error = 'Error al buscar libros. Por favor, intenta de nuevo.';
        this.loading = false;
        console.error('Error:', err);
      }
    });
  }

  extractCategories(): void {
    const categorySet = new Set<string>();
    this.books.forEach(book => {
      if (book.categories && book.categories.length > 0) {
        book.categories.forEach(cat => categorySet.add(cat));
      }
    });
    this.categories = Array.from(categorySet).sort();
  }

  onCategoryChange(category: string): void {
    this.selectedCategory = category;
    this.applyFilter();
  }

  applyFilter(): void {
    if (!this.selectedCategory) {
      this.filteredBooks = [...this.books];
    } else {
      this.filteredBooks = this.books.filter(book => 
        book.categories && book.categories.includes(this.selectedCategory)
      );
    }
  }

  onBookClick(book: Book): void {
    this.selectedBook = book;
    this.isPanelOpen = true;
  }

  onPanelClose(): void {
    this.isPanelOpen = false;
    this.selectedBook = null;
  }
}

