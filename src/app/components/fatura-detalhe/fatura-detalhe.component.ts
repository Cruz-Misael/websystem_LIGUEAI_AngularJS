import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router'; // 👈 Importa o Router
import { InvoiceService } from '../../services/invoice.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-fatura-detalhe',
  standalone: true,
  templateUrl: './fatura-detalhe.component.html',
  styleUrls: ['./fatura-detalhe.component.css'],
  imports: [CommonModule]
})
export class FaturaDetalheComponent implements OnInit {
  fatura: any = null;
  loading = false;
  today = new Date();

  constructor(
    private route: ActivatedRoute,
    private invoiceService: InvoiceService,
    private router: Router // 👈 Injetamos o router
  ) {}

  ngOnInit() {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    console.log('🧭 Componente de detalhe carregado. ID recebido:', id);
    this.buscarDetalhe(id);
  }

  buscarDetalhe(id: number) {
    this.loading = true;
    console.log('🚀 Vai chamar buscarDetalhe com ID:', id);
    this.invoiceService.getInvoiceDetailed(id).subscribe({
      next: (res) => {
        console.log('✅ API respondeu com sucesso:', res);
        this.fatura = res;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Erro ao buscar detalhe:', err);
        this.loading = false;
      }
    });
  }

  getValorTotal(): number {
    if (!this.fatura) return 0;
    const valorAssinatura = 29.9;
    const valorLigacoes = this.fatura.detailedPlanLevels
      ?.reduce((total: number, item: any) => total + (item.value || 0), 0) || 0;
    return valorAssinatura + valorLigacoes;
  } 


  getValorMinutagem(): number {
    if (!this.fatura) return 0;
    const valorLigacoes = this.fatura.detailedPlanLevels
      ?.reduce((total: number, item: any) => total + (item.value || 0), 0) || 0;
    return valorLigacoes;
  } 


  formatarDuracao(segundos: number): string {
    if (!segundos && segundos !== 0) return '-';
    const horas = Math.floor(segundos / 3600);
    const minutos = Math.floor((segundos % 3600) / 60);
    const segs = Math.floor(segundos % 60);
    return `${this.padZero(horas)}:${this.padZero(minutos)}:${this.padZero(segs)}`;
  }

  padZero(valor: number): string {
    return valor.toString().padStart(2, '0');
  }

  getChamadasAgrupadasPorServico(): Record<string, any[]> {
    const agrupadas: Record<string, any[]> = {};
    if (this.fatura?.billed_items?.length) {
      for (const item of this.fatura.billed_items) {
        for (const chamada of item.measurements) {
          const tipoServico = chamada.service_type || 'Outros';
          if (!agrupadas[tipoServico]) agrupadas[tipoServico] = [];
          agrupadas[tipoServico].push(chamada);
        }
      }
    }
    return agrupadas;
  }

  getTotalPorTipo(tipo: string): number {
    const grupos = this.getChamadasAgrupadasPorServico();
    if (!grupos[tipo]) return 0;
    return grupos[tipo].reduce(
      (soma: number, chamada: any) => soma + (chamada.monetary_value || 0),
      0
    );
  }

  // 🖨️ Imprimir fatura
  imprimirFatura() {
    window.print();
  }

  // ⬅️ Voltar à tela anterior
  voltar() {
    this.router.navigate(['']);
  }
}
