import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Usuario } from '../../models/usuario';
import { UsuarioService } from '../../core/services/usuario';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-usuarios',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuarios.html',
  styleUrl: './usuarios.css',
})
export class Usuarios implements OnInit {

  usuarios: Usuario[] = [];
  mostrarModal = false;
  editando = false;
  idEditando: number | null = null;
  errorGuardar = '';
  cargando = false;

  form = {
    nombre: '',
    email: '',
    password: '',
    rol: 'EMPLEADO'
  };

  constructor(
    private usuarioService: UsuarioService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    this.usuarioService.listar().subscribe({
      next: (data) => {
        this.usuarios = [...data];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar usuarios', err);
        this.usuarios = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModal(usuario?: Usuario): void {
    this.mostrarModal = true;
    this.errorGuardar = '';

    if (usuario) {
      this.editando = true;
      this.idEditando = usuario.id;
      this.form = {
        nombre: usuario.nombre,
        email: usuario.email,
        password: '',
        rol: usuario.rol
      };
    } else {
      this.editando = false;
      this.idEditando = null;
      this.form = { nombre: '', email: '', password: '', rol: 'EMPLEADO' };
    }

    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  guardar(): void {
    this.errorGuardar = '';

    const request$ = this.editando && this.idEditando
      ? this.usuarioService.actualizar(this.idEditando, this.form)
      : this.usuarioService.crear(this.form);

    request$.subscribe({
      next: () => {
        this.cerrarModal();
        this.cargar();
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorGuardar = err.error?.message || 'Error al guardar';
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este usuario?')) return;

    this.usuarioService.eliminar(id).subscribe({
      next: () => {
        this.cargar();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar usuario', err);
        this.cdr.detectChanges();
      }
    });
  }

  badgeRol(rol: string): string {
    return rol === 'ADMIN' ? 'badge-admin' : 'badge-empleado';
  }
}