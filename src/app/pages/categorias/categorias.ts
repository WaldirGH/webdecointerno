import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Categoria } from '../../models/categoria';
import { CategoriaService } from '../../core/services/categoria';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-categorias',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './categorias.html',
  styleUrl: './categorias.css',
})
export class Categorias implements OnInit {
  categorias: Categoria[] = [];
  categoriasFiltradas: Categoria[] = [];

  mostrarModal = false;
  editando = false;
  idEditando: number | null = null;
  nombre = '';
  busqueda = '';
  cargando = false;

  constructor(
    private categoriaService: CategoriaService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    this.categoriaService.listar().subscribe({
      next: (data) => {
        this.categorias = [...data];
        this.filtrarCategorias();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al cargar categorías', err);
        this.categorias = [];
        this.categoriasFiltradas = [];
        this.cargando = false;
        this.cdr.detectChanges();
      },
    });
  }

  filtrarCategorias(): void {
    const texto = this.busqueda.trim().toLowerCase();

    if (!texto) {
      this.categoriasFiltradas = [...this.categorias];
      this.cdr.detectChanges();
      return;
    }

    this.categoriasFiltradas = this.categorias.filter((c) =>
      c.nombre.toLowerCase().includes(texto)
    );
    this.cdr.detectChanges();
  }

  abrirModal(categoria?: Categoria): void {
    this.mostrarModal = true;

    if (categoria) {
      this.editando = true;
      this.idEditando = categoria.id;
      this.nombre = categoria.nombre;
    } else {
      this.editando = false;
      this.idEditando = null;
      this.nombre = '';
    }

    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.nombre = '';
    this.editando = false;
    this.idEditando = null;
    this.cdr.detectChanges();
  }

  guardar(): void {
    const nombreLimpio = this.nombre.trim();
    if (!nombreLimpio) return;

    const request$ =
      this.editando && this.idEditando
        ? this.categoriaService.actualizar(this.idEditando, { nombre: nombreLimpio })
        : this.categoriaService.crear({ nombre: nombreLimpio });

    request$.subscribe({
      next: () => {
        this.cerrarModal();
        this.cargar();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al guardar categoría', err);
        this.cdr.detectChanges();
      },
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar esta categoría?')) return;

    this.categoriaService.eliminar(id).subscribe({
      next: () => {
        this.cargar();
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error al eliminar categoría', err);
        this.cdr.detectChanges();
      },
    });
  }
}