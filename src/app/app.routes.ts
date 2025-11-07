import { Routes } from '@angular/router';
import { FaturasComponent } from './components/faturas/faturas.component';
import { FaturaDetalheComponent } from './components/fatura-detalhe/fatura-detalhe.component';

export const routes: Routes = [
  { path: '', component: FaturasComponent },
  { path: 'fatura/:id', component: FaturaDetalheComponent },
];
