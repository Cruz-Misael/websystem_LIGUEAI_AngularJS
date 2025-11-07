import { of, Observable } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';


@Injectable({ providedIn: 'root' })
export class InvoiceService {
  private baseUrl = 'http://177.137.116.114:9090/sippulse/bcore/v1';

  constructor(private http: HttpClient, private auth: AuthService) {}

  // 🔹 NOVO: Busca todos os clientes (customers)
  getClientes(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`,
      'accept': '*/*'
    });

    const url = `${this.baseUrl}/customers?desc=true&pageNumber=1&pageSize=3000&sorted=false`;
    return this.http.get<any>(url, { headers });
  }

  // 🔹 Lista todas as faturas (visão geral)
  getAllInvoices(): Observable<any> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });
    const url = `${this.baseUrl}/invoices?desc=true&pageNumber=1&pageSize=100&sorted=true`;
    return this.http.get<any>(url, { headers });
  }

  getInvoiceDetailed(idFatura: number): Observable<any> {
    const token = this.auth.getToken();

    const headers = new HttpHeaders()
      .set('Authorization', `Bearer ${token}`)
      .set('Accept', '*/*');

    const url = `${this.baseUrl}/invoices/detailed/${idFatura}`;
    console.log('🌐 Chamando API:', url, 'com headers:', headers);

    return this.http.get<any>(url, { headers });
  }

  getTodasAsPaginas(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Authorization': `Bearer ${this.auth.getToken()}`
    });

    const pageSize = 100;
    let pageNumber = 1;
    let todas: any[] = [];

    const fetchPage = (): Observable<any[]> => {
      const url = `${this.baseUrl}/invoices?desc=true&pageNumber=${pageNumber}&pageSize=${pageSize}&sorted=true`;
      return this.http.get<any>(url, { headers }).pipe(
        switchMap((res) => {
          todas = [...todas, ...(res.content || [])];
          if (res.last) {
            // chegou na última página
            return of(todas);
          } else {
            pageNumber++;
            return fetchPage();
          }
        })
      );
    };

    return fetchPage();
  }
}


