import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {

  menuAbierto = true;

  constructor(public authService: AuthService) { }

  toggleMenu(): void {
    this.menuAbierto = !this.menuAbierto;
  }

  logout(): void {
    this.authService.logout();
  }
}
