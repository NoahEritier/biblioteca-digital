import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BookCardComponent } from '../../components/book-card/book-card.component';
import { BookDetailPanelComponent } from '../../components/book-detail-panel/book-detail-panel.component';
import { CategoryFilterComponent } from '../../components/category-filter/category-filter.component';
import { AuthService } from '../../services/auth.service';
import { FavoritesService } from '../../services/favorites.service';
import { Book } from '../../services/google-books.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-guardados',
  standalone: true,
  imports: [CommonModule, BookCardComponent, BookDetailPanelComponent, CategoryFilterComponent],
  templateUrl: './guardados.component.html',
  styleUrl: './guardados.component.css'
})
export class GuardadosComponent implements OnInit, OnDestroy {
  favorites: Book[] = [];
  filteredFavorites: Book[] = [];
  loading: boolean = false;
  selectedBook: Book | null = null;
  isPanelOpen: boolean = false;
  selectedCategory: string = '';
  categories: string[] = [];
  private userSubscription?: Subscription;

  constructor(
    public authService: AuthService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      if (user) {
        this.loadFavorites();
      } else {
        this.favorites = [];
        this.filteredFavorites = [];
        this.categories = [];
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  loadFavorites(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.favorites = [];
      this.filteredFavorites = [];
      this.categories = [];
      return;
    }

    this.loading = true;
    this.favoritesService.getUserFavorites(user.id).subscribe({
      next: (books) => {
        this.favorites = books;
        this.extractCategories();
        this.applyFilter();
        this.loading = false;
      },
      error: (err) => {
        console.error('Error loading favorites:', err);
        this.loading = false;
      }
    });
  }

  extractCategories(): void {
    const categorySet = new Set<string>();
    this.favorites.forEach(book => {
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
      this.filteredFavorites = [...this.favorites];
    } else {
      this.filteredFavorites = this.favorites.filter(book => 
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
    // Recargar favoritos por si se eliminó alguno
    this.loadFavorites();
  }
}
