import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { Producto } from '../../models/producto';
import { Categoria } from '../../models/categoria';
import { Proveedor } from '../../models/proveedor';
import { ProductoService } from '../../core/services/producto';
import { CategoriaService } from '../../core/services/categoria';
import { ProveedorService } from '../../core/services/proveedor';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-productos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './productos.html',
  styleUrl: './productos.css',
})
export class Productos implements OnInit {

  productos: Producto[] = [];
  productosFiltrados: Producto[] = [];
  categorias: Categoria[] = [];
  proveedores: Proveedor[] = [];

  filtroCategoriaId: number = 0;

  mostrarModal = false;
  editando = false;
  cargando = false;
  idEditando: number | null = null;

  form = {
    nombre: '',
    precio: 0,
    descripcion: '',
    codigoBarra: '',
    categoriaId: 0,
    proveedorId: 0
  };

  imagenes: File[] = [];
  previews: string[] = [];

  constructor(
    private productoService: ProductoService,
    private categoriaService: CategoriaService,
    private proveedorService: ProveedorService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    this.cargar();

    this.categoriaService.listar().subscribe({
      next: d => {
        this.categorias = [...d];
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error al cargar categorías', err);
        this.cdr.detectChanges();
      }
    });

    this.proveedorService.listar().subscribe({
      next: d => {
        this.proveedores = [...d];
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error al cargar proveedores', err);
        this.cdr.detectChanges();
      }
    });
  }

  cargar(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    this.productoService.listar().subscribe({
      next: data => {
        this.productos = [...data];
        this.aplicarFiltro();
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error al cargar productos', err);
        this.productos = [];
        this.productosFiltrados = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  aplicarFiltro(): void {
    if (this.filtroCategoriaId === 0) {
      this.productosFiltrados = [...this.productos];
    } else {
      this.productosFiltrados = this.productos.filter(
        p => p.categoria?.id === this.filtroCategoriaId
      );
    }

    this.cdr.detectChanges();
  }

  onFiltroCategoriaChange(): void {
    this.aplicarFiltro();
  }

  abrirModal(producto?: Producto): void {
    this.mostrarModal = true;
    this.imagenes = [];
    this.previews = [];

    if (producto) {
      this.editando = true;
      this.idEditando = producto.id;
      this.form = {
        nombre: producto.nombre,
        precio: producto.precio,
        descripcion: producto.descripcion,
        codigoBarra: producto.codigoBarra,
        categoriaId: producto.categoria.id,
        proveedorId: producto.proveedor.id
      };
    } else {
      this.editando = false;
      this.idEditando = null;
      this.form = {
        nombre: '',
        precio: 0,
        descripcion: '',
        codigoBarra: '',
        categoriaId: 0,
        proveedorId: 0
      };
    }

    this.cdr.detectChanges();
  }

  cerrarModal(): void {
    this.mostrarModal = false;
    this.cdr.detectChanges();
  }

  onImagenesSeleccionadas(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    this.imagenes = Array.from(input.files);
    this.previews = [];
    this.cdr.detectChanges();

    this.imagenes.forEach(file => {
      const reader = new FileReader();
      reader.onload = e => {
        this.previews = [...this.previews, e.target?.result as string];
        this.cdr.detectChanges();
      };
      reader.readAsDataURL(file);
    });
  }

  guardar(): void {
    const formData = new FormData();
    formData.append('nombre', this.form.nombre);
    formData.append('precio', this.form.precio.toString());
    formData.append('descripcion', this.form.descripcion);
    formData.append('codigoBarra', this.form.codigoBarra);
    formData.append('categoriaId', this.form.categoriaId.toString());
    formData.append('proveedorId', this.form.proveedorId.toString());
    this.imagenes.forEach(img => formData.append('imagenes', img));

    const request$ = this.editando && this.idEditando
      ? this.productoService.actualizar(this.idEditando, formData)
      : this.productoService.crear(formData);

    request$.subscribe({
      next: () => {
        this.cerrarModal();
        this.cargar();
        this.cdr.detectChanges();
      },
      error: err => {
        console.error(err);
        this.cdr.detectChanges();
      }
    });
  }

  eliminar(id: number): void {
    if (!confirm('¿Eliminar este producto?')) return;

    this.productoService.eliminar(id).subscribe({
      next: () => {
        this.cargar();
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error al eliminar producto', err);
        this.cdr.detectChanges();
      }
    });
  }
}