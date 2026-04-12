import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Inventario as InventarioModel, InventarioRequest, Movimiento } from '../../models/inventario';
import { InventarioService } from '../../core/services/inventario';

@Component({
  selector: 'app-inventario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './inventario.html',
  styleUrl: './inventario.css',
})
export class Inventario implements OnInit {

  inventarios: InventarioModel[] = [];
  historial: Movimiento[] = [];
  mostrarModalMovimiento = false;
  mostrarHistorial = false;
  productoHistorialNombre = '';

  form: InventarioRequest = {
    codigoBarra: '',
    cantidad: 0,
    motivo: '',
    tipo: 'ENTRADA'
  };

  stockConsulta: InventarioModel | null = null;
  codigoConsulta = '';
  errorConsulta = '';
  errorMovimiento = '';

  tipos = ['ENTRADA', 'SALIDA', 'AJUSTE'];

  cargando = false;

  constructor(
    private inventarioService: InventarioService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.cargar();
  }

  cargar(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    this.inventarioService.listarTodos().subscribe({
      next: data => {
        this.inventarios = [...data];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error al cargar inventario', err);
        this.inventarios = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  consultarStock(): void {
    this.errorConsulta = '';
    this.stockConsulta = null;
    this.cdr.detectChanges();

    this.inventarioService.obtenerStockPorCodigo(this.codigoConsulta).subscribe({
      next: data => {
        this.stockConsulta = data;
        this.cdr.detectChanges();
      },
      error: () => {
        this.errorConsulta = 'Producto no encontrado';
        this.cdr.detectChanges();
      }
    });
  }

  abrirModalMovimiento(): void {
    this.mostrarModalMovimiento = true;
    this.errorMovimiento = '';
    this.form = { codigoBarra: '', cantidad: 0, motivo: '', tipo: 'ENTRADA' };
    this.cdr.detectChanges();
  }

  cerrarModalMovimiento(): void {
    this.mostrarModalMovimiento = false;
    this.cdr.detectChanges();
  }

  registrarMovimiento(): void {
    this.errorMovimiento = '';

    this.inventarioService.registrarMovimiento(this.form).subscribe({
      next: () => {
        this.cerrarModalMovimiento();
        this.cargar();
        this.cdr.detectChanges();
      },
      error: err => {
        this.errorMovimiento = err.error?.message || 'Error al registrar movimiento';
        this.cdr.detectChanges();
      }
    });
  }

  verHistorial(inventario: InventarioModel): void {
    this.productoHistorialNombre = inventario.nombreProducto;
    this.mostrarHistorial = true;
    this.cdr.detectChanges();

    this.inventarioService.historialPorProducto(inventario.productoId).subscribe({
      next: data => {
        this.historial = [...data];
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error al cargar historial', err);
        this.historial = [];
        this.cdr.detectChanges();
      }
    });
  }

  cerrarHistorial(): void {
    this.mostrarHistorial = false;
    this.cdr.detectChanges();
  }

  badgeTipo(tipo: string): string {
    const map: Record<string, string> = {
      ENTRADA: 'badge-entrada',
      SALIDA: 'badge-salida',
      AJUSTE: 'badge-ajuste'
    };
    return map[tipo] || '';
  }

  colorStock(stock: number): string {
    if (stock <= 0) return 'stock-agotado';
    if (stock <= 5) return 'stock-bajo';
    return 'stock-ok';
  }
}