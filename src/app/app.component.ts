import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { NavbarComponent } from './components/navbar/navbar.component';
import { ToastComponent } from './components/toast/toast.component';
import { ToastService } from './services/toast.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit, OnDestroy {
  title = 'Biblioteca Digital';
  toastMessage: string = '';
  toastType: 'success' | 'error' | 'info' | 'warning' = 'info';
  toastShow: boolean = false;
  toastDuration: number = 3000;
  private toastSubscription?: Subscription;
  private toastTimeout?: any;

  constructor(private toastService: ToastService) {}

  ngOnInit(): void {
    this.toastSubscription = this.toastService.toast$.subscribe(toast => {
      this.toastMessage = toast.message;
      this.toastType = toast.type;
      this.toastDuration = toast.duration || 3000;
      this.showToast();
    });
  }

  ngOnDestroy(): void {
    if (this.toastSubscription) {
      this.toastSubscription.unsubscribe();
    }
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
  }

  showToast(): void {
    this.toastShow = true;
    if (this.toastTimeout) {
      clearTimeout(this.toastTimeout);
    }
    this.toastTimeout = setTimeout(() => {
      this.toastShow = false;
    }, this.toastDuration);
  }
}

