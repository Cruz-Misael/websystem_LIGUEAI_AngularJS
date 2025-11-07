import 'zone.js';
import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, withHashLocation } from '@angular/router';
import { importProvidersFrom } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { routes } from './app/app.routes';
import { AppComponent } from './app/app.component'; // <-- importante

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes, withHashLocation()),
    importProvidersFrom(HttpClientModule, FormsModule, CommonModule),
  ],
}).catch(err => console.error(err));
