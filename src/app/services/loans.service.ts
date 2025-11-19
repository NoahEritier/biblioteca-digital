import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { Book } from './google-books.service';
import { StorageService } from './storage.service';

export interface Loan {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  userId: string;
  loanDate: string;
  returnDate: string;
  status: 'active' | 'returned' | 'overdue';
}

export interface Reservation {
  id: string;
  bookId: string;
  bookTitle: string;
  bookAuthor: string;
  userId: string;
  position: number;
  reservationDate: string;
  status: 'pending' | 'ready' | 'expired';
}

@Injectable({
  providedIn: 'root'
})
export class LoansService {
  private readonly LOANS_KEY = 'loans';
  private readonly RESERVATIONS_KEY = 'reservations';
  private readonly AVAILABILITY_KEY = 'bookAvailability';

  constructor(private storage: StorageService) {
    this.loadData();
  }

  private loadData(): void {
    const savedLoans = this.storage.getItem<Loan[]>(this.LOANS_KEY);
    const savedReservations = this.storage.getItem<Reservation[]>(this.RESERVATIONS_KEY);
    const savedAvailability = this.storage.getItem<Record<string, boolean>>(this.AVAILABILITY_KEY);

    if (savedLoans) {
      this.loans = savedLoans;
      // Actualizar disponibilidad basándose en préstamos activos
      savedLoans.forEach(loan => {
        if (loan.status === 'active') {
          this.bookAvailability.set(loan.bookId, false);
        }
      });
    }
    if (savedReservations) {
      this.reservations = savedReservations;
    }
    if (savedAvailability) {
      // Combinar disponibilidad guardada con la de préstamos activos
      Object.entries(savedAvailability).forEach(([bookId, available]) => {
        if (!available) {
          this.bookAvailability.set(bookId, false);
        }
      });
    }
  }

  private saveData(): void {
    this.storage.setItem(this.LOANS_KEY, this.loans);
    this.storage.setItem(this.RESERVATIONS_KEY, this.reservations);
    const availabilityObj = Object.fromEntries(this.bookAvailability);
    this.storage.setItem(this.AVAILABILITY_KEY, availabilityObj);
  }

  private loans: Loan[] = [];
  private reservations: Reservation[] = [];
  private bookAvailability: Map<string, boolean> = new Map();

  requestLoan(book: Book, userId: string): Observable<{ success: boolean; loan?: Loan; message?: string; limitReached?: boolean }> {
    return new Observable(observer => {
      setTimeout(() => {
        // Verificar límite de préstamos activos (máximo 3)
        const activeLoans = this.loans.filter(loan => loan.userId === userId && loan.status === 'active');
        if (activeLoans.length >= 3) {
          observer.next({ 
            success: false, 
            limitReached: true,
            message: 'Límite de préstamos alcanzado\nHas alcanzado el límite de 3 préstamos activos.\nPor favor, devuelve un libro antes de solicitar otro préstamo.'
          });
          observer.complete();
          return;
        }

        const isAvailable = this.bookAvailability.get(book.id) !== false;
        
        if (isAvailable) {
          const returnDate = new Date();
          returnDate.setDate(returnDate.getDate() + 14); // 14 días de préstamo
          
          const loan: Loan = {
            id: `loan_${Date.now()}`,
            bookId: book.id,
            bookTitle: book.title,
            bookAuthor: book.authors.join(', '),
            userId: userId,
            loanDate: new Date().toISOString(),
            returnDate: returnDate.toISOString(),
            status: 'active'
          };
          
          this.loans.push(loan);
          this.bookAvailability.set(book.id, false);
          this.saveData();
          
          observer.next({ success: true, loan });
        } else {
          observer.next({ 
            success: false, 
            message: 'El libro no está disponible.\n¿Deseas hacer una reserva?'
          });
        }
        observer.complete();
      }, 500);
    });
  }

  createReservation(book: Book, userId: string): Observable<{ success: boolean; reservation?: Reservation; message?: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        // Calcular posición en la fila
        const existingReservations = this.reservations.filter(r => r.bookId === book.id);
        const position = existingReservations.length + 1;
        
        const reservation: Reservation = {
          id: `res_${Date.now()}`,
          bookId: book.id,
          bookTitle: book.title,
          bookAuthor: book.authors.join(', '),
          userId: userId,
          position: position,
          reservationDate: new Date().toISOString(),
          status: 'pending'
        };
        
        this.reservations.push(reservation);
        this.saveData();
        
        observer.next({ success: true, reservation });
        observer.complete();
      }, 500);
    });
  }

  getUserLoans(userId: string): Observable<Loan[]> {
    return of(this.loans.filter(loan => loan.userId === userId)).pipe(delay(300));
  }

  getUserReservations(userId: string): Observable<Reservation[]> {
    return of(this.reservations.filter(res => res.userId === userId)).pipe(delay(300));
  }

  getReservationPosition(bookId: string, userId: string): number {
    const userReservation = this.reservations.find(r => r.bookId === bookId && r.userId === userId);
    return userReservation ? userReservation.position : 0;
  }

  isBookAvailable(bookId: string): boolean {
    return this.bookAvailability.get(bookId) !== false;
  }
}

