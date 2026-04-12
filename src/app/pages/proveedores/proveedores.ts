import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Proveedor } from '../../models/proveedor';
import { ProveedorService } from '../../core/services/proveedor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-proveedores',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './proveedores.html',
  styleUrl: './proveedores.css',
})
export class Proveedores implements OnInit {

  proveedores: Proveedor[] = [];
  mostrarModal = false;
  editando = false;
  idEditando: number | null = null;

  form = { ruc: '', nombre: '' };
  buscandoRuc = false;
  errorRuc = '';
  cargando = false;

  constructor(
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    this.proveedorService.listar().subscribe({
      next: (data) => {
        this.proveedores = [...data];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar proveedores', err);
        this.proveedores = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  abrirModal(proveedor?: Proveedor): void {
    this.mostrarModal = true;
    this.errorRuc = '';

    if (proveedor) {
      this.editando = true;
      this.idEditando = proveedor.id;
      this.form = { ruc: proveedor.ruc, nombre: proveedor.nombre };
    } else {
      this.editando = false;
      this.idEditando = null;
      this.form = { ruc: '', nombre: '' };
    }

    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  buscarRuc(): void {
    if (this.form.ruc.length !== 11) {
      this.errorRuc = 'El RUC debe tener 11 dígitos';
      this.cdr.detectChanges();
      return;
    }

    this.buscandoRuc = true;
    this.errorRuc = '';
    this.cdr.detectChanges();

    fetch(`https://decobackend.onrender.com/api/public/sunat/ruc/${this.form.ruc}`)
      .then(r => r.json())
      .then(data => {
        this.form.nombre = data.razon_social;
        this.buscandoRuc = false;
        this.cdr.detectChanges();
      })
      .catch(() => {
        this.errorRuc = 'No se encontró el RUC';
        this.buscandoRuc = false;
        this.cdr.detectChanges();
      });
  }

  guardar(): void {
    const request$ = this.editando && this.idEditando
      ? this.proveedorService.actualizar(this.idEditando, this.form)
      : this.proveedorService.crear(this.form);

    request$.subscribe({
      next: () => {
        this.cerrarModal();
        this.cargar();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar proveedor', err);
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este proveedor?')) return;

    this.proveedorService.eliminar(id).subscribe({
      next: () => {
        this.cargar();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar proveedor', err);
        this.cdr.detectChanges();
      }
    });
  }
}