import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { NgSelectModule } from '@ng-select/ng-select';
import { InvoiceService } from '../../services/invoice.service';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-faturas',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule, NgSelectModule],
  templateUrl: './faturas.component.html',
  styleUrls: ['./faturas.component.css']
})
export class FaturasComponent implements OnInit {
  faturas: any[] = [];
  faturasFiltradas: any[] = [];
  filtroCliente: string = '';
  filtroMes: string = '';
  filtroAno: string = '';
  loading = false;
  today = new Date();

  meses = [
    { nome: 'Janeiro', valor: '01' },
    { nome: 'Fevereiro', valor: '02' },
    { nome: 'Março', valor: '03' },
    { nome: 'Abril', valor: '04' },
    { nome: 'Maio', valor: '05' },
    { nome: 'Junho', valor: '06' },
    { nome: 'Julho', valor: '07' },
    { nome: 'Agosto', valor: '08' },
    { nome: 'Setembro', valor: '09' },
    { nome: 'Outubro', valor: '10' },
    { nome: 'Novembro', valor: '11' },
    { nome: 'Dezembro', valor: '12' },
  ];

  anos = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i);

  constructor(
    private invoiceService: InvoiceService,
    private auth: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    this.auth.login().subscribe({
      next: () => this.buscarTodas(),
      error: () => alert('Erro ao autenticar.'),
    });
  }

  buscarTodas() {
    this.loading = true;
    this.invoiceService.getTodasAsPaginas().subscribe({
      next: (res) => {
        this.faturas = res;
        this.loading = false;
        console.log('Total de faturas carregadas:', this.faturas.length);
      },
      error: (err) => {
        this.loading = false;
        console.error('Erro ao buscar faturas:', err);
      }
    });
  }

  filtrarFaturas() {
    this.faturasFiltradas = this.faturas.filter(f => {
      const nomeOk = f.clientName?.toLowerCase().includes(this.filtroCliente.toLowerCase());
      const data = new Date(f.emissionDate);
      const mesOk = !this.filtroMes || (String(data.getMonth() + 1).padStart(2, '0') === this.filtroMes);
      const anoOk = !this.filtroAno || (data.getFullYear() === +this.filtroAno);
      return nomeOk && mesOk && anoOk;
    });
  }

  abrirDetalhe(fatura: any) {
    this.router.navigate(['/fatura', fatura.id]);
  }
}
