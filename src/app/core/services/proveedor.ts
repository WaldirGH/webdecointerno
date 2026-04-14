import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Proveedor } from '../../models/proveedor';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProveedorService {

  private url = `${environment.apiUrl}/proveedores`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Proveedor[]> {
    return this.http.get<Proveedor[]>(this.url);
  }

  obtenerPorId(id: number): Observable<Proveedor> {
    return this.http.get<Proveedor>(`${this.url}/${id}`);
  }

  crear(proveedor: { ruc: string; nombre: string }): Observable<Proveedor> {
    return this.http.post<Proveedor>(this.url, proveedor);
  }

  actualizar(id: number, proveedor: { ruc: string; nombre: string }): Observable<Proveedor> {
    return this.http.put<Proveedor>(`${this.url}/${id}`, proveedor);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.url}/${id}`);
  }
}
