// src/app/services/pdf.service.ts
import { Injectable } from '@angular/core';
import * as pdfMake from 'pdfmake/build/pdfmake';
import * as pdfFonts from 'pdfmake/build/vfs_fonts';
(<any>pdfMake).vfs = (pdfFonts as any).vfs;

@Injectable({ providedIn: 'root' })
export class PdfService {
  private brl(v: number) {
    return v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  }

  generateInvoicePdf(data: any) {
    const cliente = data.fantasyName;
    const doc = data.document;
    const contrato = data.contract_number;
    const inicio = new Date(data.summary.start_measurement_date).toLocaleDateString('pt-BR');
    const fim = new Date(data.summary.final_measurement_date).toLocaleDateString('pt-BR');

    const detalhamento = data.detailedPlanLevels.map((x: any) => [
      x.accountCode,
      x.units.name,
      this.brl(x.price),
      x.duration,
      this.brl(x.value)
    ]);

    const ligacoes = data.billed_items[0]?.measurements?.map((m: any) => [
      m.accountcode,
      m.service_type,
      m.caller,
      m.callee,
      new Date(m.begin_date).toLocaleString('pt-BR'),
      m.duration,
      this.brl(m.monetary_value)
    ]) || [];

    const docDefinition: any = {
      content: [
        { text: 'Recibo de Ligações - Sebratel', style: 'header' },
        { text: `Cliente: ${cliente}\nCPF/CNPJ: ${doc}\nContrato: ${contrato}\nPeríodo: ${inicio} a ${fim}\n\n` },

        { text: 'Resumo por Tipo de Serviço', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 60, 60, 60, 60],
            body: [
              ['Conta', 'Tipo', 'Preço', 'Duração', 'Valor'],
              ...detalhamento
            ]
          }
        },
        { text: '\nDetalhamento de Ligações', style: 'subheader' },
        {
          table: {
            headerRows: 1,
            widths: ['*', 50, 60, 60, 100, 60, 60],
            body: [
              ['Conta', 'Tipo', 'Origem', 'Destino', 'Data/Hora', 'Segundos', 'Valor'],
              ...ligacoes
            ]
          }
        }
      ],
      styles: {
        header: { fontSize: 16, bold: true },
        subheader: { fontSize: 12, bold: true, margin: [0, 10, 0, 5] }
      }
    };

    pdfMake.createPdf(docDefinition).download(`recibo_${cliente}.pdf`);
  }
}
