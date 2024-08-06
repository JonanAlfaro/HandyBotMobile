import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpHeaders  } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})


export class MovimientoService {

  httpClient = inject(HttpClient);




  getAll(): Promise<Movimiento[]> {

    const token = localStorage.getItem('auth-token');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'x-access-token': '' + token
    });
    return firstValueFrom(
      this.httpClient.get<Movimiento[]>(`http://localhost:4000/movements`, { headers })
    )
  }

  constructor() { }
}


export interface Movimiento {
  _id: string;
  creadoPor: string;
  descripcion: string;
  comandos:[],
}
