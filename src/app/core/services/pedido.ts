import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Pedido } from '../../models/pedido';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class PedidoService {

  private url = `${environment.apiUrl}/admin/pedidos`;

  constructor(private http: HttpClient) {}

  listarTodos(): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(this.url);
  }

  obtenerPorId(id: number): Observable<Pedido> {
    return this.http.get<Pedido>(`${this.url}/${id}`);
  }

  listarPorEstado(estado: string): Observable<Pedido[]> {
    return this.http.get<Pedido[]>(`${this.url}/estado/${estado}`);
  }

  cambiarEstado(id: number, estado: string): Observable<Pedido> {
    return this.http.patch<Pedido>(`${this.url}/${id}/estado?estado=${estado}`, {});
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
