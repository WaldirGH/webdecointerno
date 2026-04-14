import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Inventario, InventarioRequest, Movimiento } from '../../models/inventario';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class InventarioService {

  private url = `${environment.apiUrl}/admin/inventario`;

  constructor(private http: HttpClient) { }

  listarTodos(): Observable<Inventario[]> {
    return this.http.get<Inventario[]>(this.url);
  }

  obtenerStockPorCodigo(codigoBarra: string): Observable<Inventario> {
    return this.http.get<Inventario>(`${this.url}/producto/codigo/${codigoBarra}`);
  }

  historialPorProducto(productoId: number): Observable<Movimiento[]> {
    return this.http.get<Movimiento[]>(`${this.url}/producto/${productoId}/historial`);
  }

  registrarMovimiento(request: InventarioRequest): Observable<Inventario> {
    return this.http.post<Inventario>(`${this.url}/movimiento`, request);
  }
}
