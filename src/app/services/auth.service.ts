import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StorageService } from './storage.service';

export interface User {
  id: string;
  username: string;
  password: string;
  fullName: string;
  email: string;
  role: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private readonly USERS_KEY = 'users';
  private readonly CURRENT_USER_KEY = 'currentUser';

  // Usuarios de prueba (en producción esto vendría de una API)
  private defaultUsers: User[] = [
    {
      id: '1',
      username: 'admin',
      password: 'admin123',
      fullName: 'Juan Pérez',
      email: 'juan.perez@example.com',
      role: 'Usuario estándar'
    },
    {
      id: '2',
      username: 'user',
      password: 'user123',
      fullName: 'María García',
      email: 'maria.garcia@example.com',
      role: 'Usuario estándar'
    }
  ];

  constructor(private storage: StorageService) {
    // Inicializar usuarios si no existen
    this.initializeUsers();
    
    // Verificar si hay sesión guardada
    const savedUser = this.storage.getItem<User>(this.CURRENT_USER_KEY);
    if (savedUser) {
      this.currentUserSubject.next(savedUser);
    }
  }

  private initializeUsers(): void {
    const savedUsers = this.storage.getItem<User[]>(this.USERS_KEY);
    if (!savedUsers) {
      this.storage.setItem(this.USERS_KEY, this.defaultUsers);
    }
  }

  private getUsers(): User[] {
    return this.storage.getItem<User[]>(this.USERS_KEY) || this.defaultUsers;
  }

  login(username: string, password: string): Observable<{ success: boolean; user?: User; message?: string }> {
    return new Observable(observer => {
      setTimeout(() => {
        const users = this.getUsers();
        const user = users.find(u => u.username === username && u.password === password);
        
        if (user) {
          const userWithoutPassword = { ...user };
          delete (userWithoutPassword as any).password;
          
          this.currentUserSubject.next(userWithoutPassword);
          this.storage.setItem(this.CURRENT_USER_KEY, userWithoutPassword);
          observer.next({ success: true, user: userWithoutPassword });
        } else {
          observer.next({ success: false, message: 'Usuario o contraseña incorrectos' });
        }
        observer.complete();
      }, 300);
    });
  }

  logout(): void {
    this.currentUserSubject.next(null);
    this.storage.removeItem(this.CURRENT_USER_KEY);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.currentUserSubject.value !== null;
  }
}

