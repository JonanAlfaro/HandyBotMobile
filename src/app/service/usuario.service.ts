import { Injectable,inject } from '@angular/core';
import { map, tap, switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {  firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class UsuarioService {

  constructor() { }

  http = inject(HttpClient);

  registrar (user: Usuario): Promise<any> {
  return firstValueFrom(this.http.post<any>(`http://localhost:4000/auth/register`,user,{
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }))
  }
}

export interface Usuario {
  nombre: string,
  email: string,
  password: string,
  idAdmin: string,
}

