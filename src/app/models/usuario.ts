export interface Usuario {
    id: number;
    nombre: string;
    email: string;
    rol: 'ADMIN' | 'EMPLEADO';
}

export interface LoginRequest {
    email: string;
    password: string;
}

export interface AuthResponse {
    token: string;
    nombre: string;
    email: string;
    rol: 'ADMIN' | 'EMPLEADO';
}
