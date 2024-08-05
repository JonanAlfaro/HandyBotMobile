import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Storage } from '@ionic/storage-angular';

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
    return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
      map((data: any) => data.token),
      switchMap((token) => {
		localStorage.setItem(TOKEN_KEY, token);
        return from(token);
      }),
      tap(() => {
        this.isAuthenticated.next(true);
      })
    );
  }

  logout(): void {
    this.isAuthenticated.next(false);
    return localStorage.removeItem(TOKEN_KEY);
  }
}