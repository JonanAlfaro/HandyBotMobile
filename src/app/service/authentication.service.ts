import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';

const TOKEN_KEY = 'auth-token';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationService {
  // Init with null to filter out the first value in a guard!
  isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  token = '';

  constructor( private http: HttpClient) {
    this.init();
  }

  async init() {
	localStorage
    this.loadToken();
  }

  async loadToken() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      console.log('set token: ', token);
      this.token = token;
      this.isAuthenticated.next(true);
    } else {
      this.isAuthenticated.next(false);
    }
  }

  login(credentials: { email: string; password: string }): Observable<any> {
    return this.http.post<any>(`http://localhost:4000/auth/login`, credentials, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((data: any) => data.token), // Extrae el token del `data`
      tap((token) => {
        console.log(token);
        localStorage.setItem(TOKEN_KEY, token); // Guarda el token en `localStorage`
        this.isAuthenticated.next(true); // Actualiza el estado de autenticación
      })
    );
  }

  logout(): void {
    this.isAuthenticated.next(false);
    return localStorage.removeItem(TOKEN_KEY);
  }
}