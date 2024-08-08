import { Injectable,inject } from '@angular/core';
import { HttpClient,HttpHeaders} from '@angular/common/http';
import { Observable } from 'rxjs/internal/Observable';
import { map, tap } from 'rxjs';
@Injectable({
  providedIn: 'root'
})
export class HandTrakingService {
  private movements: string[] = [];
  private isRecording: boolean = false;
  private recordingStartTime: number | null = null;

  constructor() { }
  http = inject(HttpClient);

  playRecording(comandos: string[]): Observable<any> {
    return this.http.post<any>(`http://localhost:4000/webSocket/`, comandos, {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      })
    }).pipe(
      map((data: any) => data),
      tap((data: any) => {
         return data;
      })
    );
  }

  startRecording() {
    this.movements = [];
    this.isRecording = true;
    this.recordingStartTime = Date.now();
  }

  stopRecording() {
    this.isRecording = false;
    this.recordingStartTime = null;
  }

  addMovement(movement: string) {
    if (this.isRecording && this.recordingStartTime) {
      const currentTime = Date.now();
      if (currentTime - this.recordingStartTime <= 10000) { // 10 seconds
        this.movements.push(movement);
      } else {
        this.stopRecording();
      }
    }
  }

  getMovements(): string[] {
    return this.movements;
  }
}

