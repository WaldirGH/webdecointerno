import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LoginRequest } from '../../models/usuario';
import { AuthService } from '../../core/services/auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  request: LoginRequest = { email: '', password: '' };
  error: string = '';
  cargando: boolean = false;

  constructor(private authService: AuthService, private router: Router) { }

  login(): void {
    this.error = '';
    this.cargando = true;

    this.authService.login(this.request).subscribe({
      next: () => {
        this.cargando = false;
        this.router.navigate(['/dashboard/pedidos']);
      },
      error: () => {
        this.cargando = false;
        this.error = 'Correo o contraseña incorrectos';
      }
    });
  }
}
