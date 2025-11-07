import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // ✅ permite exibir rotas
  template: `<router-outlet></router-outlet>`, // ✅ ponto onde as rotas serão carregadas
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'painel-telefonia';
}
