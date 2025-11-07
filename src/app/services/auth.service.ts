// src/app/services/auth.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private baseUrl = 'http://177.137.116.114:9090/sippulse/bcore/v1';
  private token: string | null = null;

  constructor(private http: HttpClient) {}

  login() {
    const body = {
      email: 'conect.bcore@sebratel.com.br',
      password: 'FatsebraTEL25'
    };
    return this.http.post<any>(`${this.baseUrl}/auth`, body)
      .pipe(tap(res => this.token = res.token));
  }

  getToken(): string | null {
    return this.token;
  }
}
