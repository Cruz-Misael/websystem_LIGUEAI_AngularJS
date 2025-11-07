import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { routes } from './app/app.routes';
import { FaturasComponent } from './app/components/faturas/faturas.component';

bootstrapApplication(FaturasComponent, {
  providers: [
    provideRouter(routes),
    importProvidersFrom(HttpClientModule, FormsModule, CommonModule)
  ]
}).catch(err => console.error(err));
