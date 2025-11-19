import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../services/google-books.service';
import { AuthService } from '../../services/auth.service';
import { LoansService } from '../../services/loans.service';
import { FavoritesService } from '../../services/favorites.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-book-detail-panel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-detail-panel.component.html',
  styleUrl: './book-detail-panel.component.css'
})
export class BookDetailPanelComponent implements OnInit, OnChanges {
  @Input() book: Book | null = null;
  @Input() isOpen: boolean = false;
  @Output() close = new EventEmitter<void>();

  defaultImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjMwMCIgZmlsbD0iIzhCNkY0NyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0ibW9ub3NwYWNlIiBmb250LXNpemU9IjE0IiBmaWxsPSIjRjVFNkQzIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iLjNlbSI+Tm8gUG9ydGFkYTwvdGV4dD48L3N2Zz4=';
  isFavorite: boolean = false;

  constructor(
    private authService: AuthService,
    private loansService: LoansService,
    private favoritesService: FavoritesService,
    private toastService: ToastService
  ) {}

  ngOnInit(): void {
    this.checkFavoriteStatus();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['book'] && this.book) {
      this.checkFavoriteStatus();
    }
  }

  checkFavoriteStatus(): void {
    const user = this.authService.getCurrentUser();
    if (user && this.book) {
      this.isFavorite = this.favoritesService.isFavorite(this.book.id, user.id);
    }
  }

  getAuthors(): string {
    return this.book?.authors?.join(', ') || 'Autor desconocido';
  }

  getRating(): number {
    return this.book?.averageRating || 0;
  }

  getRatingCount(): number {
    return this.book?.ratingsCount || 0;
  }

  getStars(): number[] {
    const rating = Math.round(this.getRating());
    return Array(5).fill(0).map((_, i) => i < rating ? 1 : 0);
  }

  onClose(): void {
    this.close.emit();
  }

  onBackdropClick(event: Event): void {
    if (event.target === event.currentTarget) {
      this.onClose();
    }
  }

  onImageError(event: Event): void {
    const img = event.target as HTMLImageElement;
    if (img) {
      img.src = this.defaultImage;
    }
  }

  onAddToFavorites(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.warning('Debes iniciar sesión para añadir a favoritos');
      return;
    }

    if (!this.book) return;

    if (this.isFavorite) {
      // Quitar de favoritos
      if (!this.book) return;
      const bookTitle = this.book.title;
      this.favoritesService.removeFromFavorites(this.book.id, user.id).subscribe({
        next: () => {
          this.isFavorite = false;
          this.toastService.success(
            `Libro eliminado de favoritos\n${bookTitle}`,
            3000
          );
        }
      });
    } else {
      // Añadir a favoritos
      if (!this.book) return;
      const bookTitle = this.book.title;
      this.favoritesService.addToFavorites(this.book, user.id).subscribe({
        next: (response) => {
          if (response.success) {
            this.isFavorite = true;
            this.toastService.success(
              `${response.message}\n${bookTitle}`,
              3000
            );
          } else {
            this.toastService.info(
              `${response.message}\n${bookTitle}`,
              3000
            );
          }
        }
      });
    }
  }

  onRequestLoan(): void {
    const user = this.authService.getCurrentUser();
    if (!user) {
      this.toastService.warning('Debes iniciar sesión para pedir un préstamo');
      return;
    }

    if (!this.book) return;

    this.loansService.requestLoan(this.book, user.id).subscribe({
      next: (response) => {
        if (response.success && response.loan) {
          const returnDate = new Date(response.loan.returnDate);
          const formattedDate = returnDate.toLocaleDateString('es-ES', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
          });

          this.toastService.success(
            `Préstamo confirmado\n${response.loan.bookTitle}\n${response.loan.bookAuthor}\nFecha de devolución: ${formattedDate}`,
            5000
          );
        } else if (response.limitReached) {
          // Límite de préstamos alcanzado
          this.toastService.warning(response.message || 'Límite de préstamos alcanzado', 5000);
        } else {
          // Libro no disponible, ofrecer reserva
          if (!this.book) return;
          
          const position = this.loansService.getReservationPosition(this.book.id, user.id);
          if (position > 0) {
            this.toastService.warning(
              `El libro está prestado\nYa tienes una reserva en posición ${position}\nde la fila de espera.`,
              5000
            );
          } else {
            this.toastService.warning(
              response.message || 'El libro no está disponible.\n¿Deseas hacer una reserva?',
              5000
            );
            // Aquí podrías abrir un diálogo de confirmación para la reserva
            if (confirm('¿Deseas hacer una reserva para este libro?')) {
              this.onCreateReservation();
            }
          }
        }
      }
    });
  }

  onCreateReservation(): void {
    const user = this.authService.getCurrentUser();
    if (!user || !this.book) return;

    this.loansService.createReservation(this.book, user.id).subscribe({
      next: (response) => {
        if (response.success && response.reservation) {
          this.toastService.success(
            `Reserva creada\n${response.reservation.bookTitle}\n${response.reservation.bookAuthor}\nPosición en la fila: ${response.reservation.position}`,
            5000
          );
        } else {
          this.toastService.error(
            response.message || 'Error al crear la reserva',
            5000
          );
        }
      }
    });
  }
}

