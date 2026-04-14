import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Producto } from '../../models/producto';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ProductoService {

  private url = `${environment.apiUrl}/admin/productos`;

  constructor(private http: HttpClient) { }

  listar(): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.apiUrl}/productos`);
  }

  obtenerPorId(id: number): Observable<Producto> {
    return this.http.get<Producto>(`${environment.apiUrl}/productos/${id}`);
  }

  listarPorCategoria(categoriaId: number): Observable<Producto[]> {
    return this.http.get<Producto[]>(`${environment.apiUrl}/productos/categoria/${categoriaId}`);
  }

  crear(formData: FormData): Observable<Producto> {
    return this.http.post<Producto>(`${environment.apiUrl}/productos`, formData);
  }

  actualizar(id: number, formData: FormData): Observable<Producto> {
    return this.http.put<Producto>(`${environment.apiUrl}/productos/${id}`, formData);
  }

  eliminar(id: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/productos/${id}`);
  }
}