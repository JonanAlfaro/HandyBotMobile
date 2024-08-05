import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, tap, switchMap } from 'rxjs/operators';
import { BehaviorSubject, from, Observable } from 'rxjs';
import { Storage } from '@ionic/storage';
const TOKEN_KEY = 'auth-token';

@Injectable({
	providedIn: 'root'
})
export class AuthenticationModels {
	// Init with null to filter out the first value in a guard!
	isAuthenticated: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
	token = '';

	constructor(private http: HttpClient,private storage: Storage,) {
		this.loadToken();
	}

	async loadToken() {
		const token = await this.storage.get(TOKEN_KEY);
		if (token && token.value) {
			console.log('set token: ', token.value);
			this.token = token.value;
			this.isAuthenticated.next(true);
		} else {
			this.isAuthenticated.next(false);
		}
	}

	login(credentials: { email: string; password:string }): Observable<any> {
		return this.http.post(`https://reqres.in/api/login`, credentials).pipe(
			map((data: any) => data.token),
			switchMap((token) => {
				return from(this.storage.set(TOKEN_KEY, token));
			}),
			tap((_) => {
				this.isAuthenticated.next(true);
			})
		);
	}

	logout(): Promise<void> {
		this.isAuthenticated.next(false);
		return this.storage.remove(TOKEN_KEY);
	}
}