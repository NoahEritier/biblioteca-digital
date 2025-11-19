import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { UserProfileService } from '../../services/user-profile.service';
import { AuthService, User } from '../../services/auth.service';
import { LoansService, Loan, Reservation } from '../../services/loans.service';
import { FavoritesService } from '../../services/favorites.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-perfil',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './perfil.component.html',
  styleUrl: './perfil.component.css'
})
export class PerfilComponent implements OnInit, OnDestroy {
  currentUser: User | null = null;
  loginForm = {
    username: '',
    password: ''
  };
  loginError: string = '';
  isLoading: boolean = false;
  
  user: any = {
    id: '1',
    fullName: 'Juan Pérez',
    email: 'juan.perez@example.com',
    role: 'Usuario estándar',
    accountStatus: 'Activa',
    registrationDate: '2023-01-15',
    avatar: null,
    personalData: {
      firstName: 'Juan',
      lastName: 'Pérez',
      phone: '+34 600 123 456',
      dni: '12345678A',
      birthDate: '1990-05-20',
      address: {
        street: 'Calle Principal',
        number: '123',
        city: 'Madrid',
        province: 'Madrid',
        postalCode: '28001'
      }
    },
    preferences: {
      notifications: {
        email: true,
        loanExpiration: true,
        reservationAvailable: true,
        fines: true,
        weeklySummary: false
      },
      interface: {
        darkMode: false,
        textSize: 'medium',
        compactView: false
      },
      accessibility: {
        highContrast: false,
        reducedAnimations: false,
        underlineLinks: true
      }
    },
    activity: {
      loans: [],
      reservations: [],
      favorites: []
    },
    statistics: {
      totalBooksRead: 45,
      favoriteCategory: 'Ficción',
      readingSpeed: '2.5 libros/mes',
      loansPerMonth: 3,
      memberSince: '2023-01-15'
    },
    security: {
      lastLogin: '2024-11-18 14:30:00',
      devices: [],
      locations: []
    }
  };

  editingSection: string | null = null;
  editData: any = {};
  expandedSections: Set<string> = new Set(['personalData', 'preferences', 'activity', 'statistics', 'security']);
  activeTab: string = 'loans';
  formErrors: any = {};
  loans: Loan[] = [];
  reservations: Reservation[] = [];
  favorites: any[] = [];
  private userSubscription?: Subscription;

  constructor(
    private profileService: UserProfileService,
    private authService: AuthService,
    private loansService: LoansService,
    private favoritesService: FavoritesService
  ) {}

  ngOnInit(): void {
    this.userSubscription = this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      if (user) {
        this.loadUserProfile();
        this.loadUserData();
      }
    });
  }

  ngOnDestroy(): void {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
  }

  onLogin(): void {
    this.loginError = '';
    this.isLoading = true;

    this.authService.login(this.loginForm.username, this.loginForm.password).subscribe({
      next: (response) => {
        this.isLoading = false;
        if (response.success && response.user) {
          this.currentUser = response.user;
          this.loadUserProfile();
          this.loadUserData();
        } else {
          this.loginError = response.message || 'Error al iniciar sesión';
        }
      },
      error: () => {
        this.isLoading = false;
        this.loginError = 'Error al iniciar sesión';
      }
    });
  }

  onLogout(): void {
    this.authService.logout();
    this.currentUser = null;
    this.loginForm = { username: '', password: '' };
  }

  loadUserData(): void {
    if (!this.currentUser) return;

    this.loansService.getUserLoans(this.currentUser.id).subscribe({
      next: (loans) => {
        this.loans = loans;
      }
    });

    this.loansService.getUserReservations(this.currentUser.id).subscribe({
      next: (reservations) => {
        this.reservations = reservations;
      }
    });

    this.favoritesService.getUserFavorites(this.currentUser.id).subscribe({
      next: (favorites) => {
        this.favorites = favorites;
      }
    });
  }

  loadUserProfile(): void {
    if (!this.currentUser) return;
    
    // Sincronizar datos del usuario autenticado
    this.user = {
      ...this.user,
      id: this.currentUser.id,
      fullName: this.currentUser.fullName,
      email: this.currentUser.email,
      role: this.currentUser.role
    };

    this.profileService.getUserProfile().subscribe({
      next: (data) => {
        if (data) {
          this.user = { ...this.user, ...data };
        }
      },
      error: (err) => {
        console.error('Error loading profile:', err);
      }
    });
  }

  startEditing(section: string): void {
    this.editingSection = section;
    this.formErrors = {};
    if (section === 'personalData') {
      this.editData = JSON.parse(JSON.stringify(this.user.personalData));
    } else if (section === 'preferences') {
      this.editData = JSON.parse(JSON.stringify(this.user.preferences));
    }
  }

  cancelEditing(): void {
    if (confirm('¿Descartar los cambios realizados?')) {
      this.editingSection = null;
      this.editData = {};
      this.formErrors = {};
    }
  }

  validateForm(section: string): boolean {
    this.formErrors = {};
    let isValid = true;

    if (section === 'personalData') {
      if (!this.editData.firstName || this.editData.firstName.trim() === '') {
        this.formErrors.firstName = 'El nombre es obligatorio';
        isValid = false;
      }
      if (!this.editData.lastName || this.editData.lastName.trim() === '') {
        this.formErrors.lastName = 'El apellido es obligatorio';
        isValid = false;
      }
      if (!this.editData.dni || this.editData.dni.trim() === '') {
        this.formErrors.dni = 'El DNI es obligatorio';
        isValid = false;
      } else if (!/^[0-9]{8}[A-Z]$/i.test(this.editData.dni)) {
        this.formErrors.dni = 'Formato de DNI inválido';
        isValid = false;
      }
      if (this.editData.phone && !/^\+?[0-9\s-]+$/.test(this.editData.phone)) {
        this.formErrors.phone = 'Formato de teléfono inválido';
        isValid = false;
      }
    }

    return isValid;
  }

  saveChanges(section: string): void {
    if (!this.validateForm(section)) {
      return;
    }

    if (confirm('¿Confirmar cambios?')) {
      if (section === 'personalData') {
        this.user.personalData = { ...this.editData };
      } else if (section === 'preferences') {
        this.user.preferences = { ...this.editData };
      }
      
      this.profileService.updateUserProfile(this.user).subscribe({
        next: () => {
          this.editingSection = null;
          this.editData = {};
          this.formErrors = {};
        },
        error: (err) => {
          console.error('Error saving profile:', err);
          alert('Error al guardar los cambios');
        }
      });
    }
  }

  getInitials(): string {
    const names = this.user.fullName.split(' ');
    return names.map((n: string) => n[0]).join('').toUpperCase().slice(0, 2);
  }

  copyToClipboard(text: string): void {
    navigator.clipboard.writeText(text).then(() => {
      // Mostrar feedback visual
    });
  }

  toggleSection(section: string): void {
    if (this.expandedSections.has(section)) {
      this.expandedSections.delete(section);
    } else {
      this.expandedSections.add(section);
    }
  }

  isSectionExpanded(section: string): boolean {
    return this.expandedSections.has(section);
  }

  setActiveTab(tab: string): void {
    this.activeTab = tab;
  }

  changeAvatar(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files[0]) {
      const file = input.files[0];
      this.profileService.updateAvatar(file).subscribe({
        next: (url) => {
          this.user.avatar = url;
        },
        error: (err) => {
          console.error('Error uploading avatar:', err);
        }
      });
    }
  }

  removeAvatar(): void {
    if (confirm('¿Quitar la imagen de perfil?')) {
      this.user.avatar = null;
    }
  }

  removeFavorite(bookId: string): void {
    if (!this.currentUser) return;
    
    this.favoritesService.removeFromFavorites(bookId, this.currentUser.id).subscribe({
      next: () => {
        this.loadUserData();
      }
    });
  }
}
