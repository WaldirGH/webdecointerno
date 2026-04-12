import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Pedido } from '../../models/pedido';
import { PedidoService } from '../../core/services/pedido';

@Component({
  selector: 'app-pedidos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './pedidos.html',
  styleUrl: './pedidos.css',
})
export class Pedidos implements OnInit {

  pedidos: Pedido[] = [];
  pedidoSeleccionado: Pedido | null = null;
  cargando = false;
  filtroEstado = '';

  estados = ['PENDIENTE', 'EN_PROCESO', 'ENVIADO', 'ENTREGADO'];

  constructor(
    private pedidoService: PedidoService,
    private cdr: ChangeDetectorRef
  ) { }

  ngOnInit(): void {
    console.log('Pedidos ngOnInit');
    this.cargar();
  }

  cargar(): void {
    console.log('Cargar pedidos...');
    this.cargando = true;
    this.cdr.detectChanges();

    this.pedidoService.listarTodos().subscribe({
      next: data => {
        console.log('Pedidos recibidos:', data);
        this.pedidos = [...data];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error al cargar pedidos', err);
        this.pedidos = [];
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  filtrar(): void {
    this.cargando = true;
    this.cdr.detectChanges();

    if (!this.filtroEstado) {
      this.cargar();
      return;
    }

    this.pedidoService.listarPorEstado(this.filtroEstado).subscribe({
      next: data => {
        this.pedidos = [...data];
        this.cargando = false;
        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error al filtrar pedidos', err);
        this.cargando = false;
        this.cdr.detectChanges();
      }
    });
  }

  verDetalle(pedido: Pedido): void {
    this.pedidoSeleccionado = pedido;
  }

  cerrarDetalle(): void {
    this.pedidoSeleccionado = null;
  }

  cambiarEstado(pedido: Pedido, estado: string): void {
    if (pedido.estado === estado) return;

    this.pedidoService.cambiarEstado(pedido.id, estado).subscribe({
      next: actualizado => {
        const index = this.pedidos.findIndex(p => p.id === pedido.id);
        if (index !== -1) {
          this.pedidos[index] = actualizado;
          this.pedidos = [...this.pedidos];
        }

        if (this.pedidoSeleccionado?.id === pedido.id) {
          this.pedidoSeleccionado = actualizado;
        }

        this.cdr.detectChanges();
      },
      error: err => {
        console.error('Error al cambiar estado', err);
      }
    });
  }

  badgeEstado(estado: string): string {
    const map: Record<string, string> = {
      PENDIENTE: 'badge-pendiente',
      EN_PROCESO: 'badge-proceso',
      ENVIADO: 'badge-enviado',
      ENTREGADO: 'badge-entregado'
    };
    return map[estado] || '';
  }
}