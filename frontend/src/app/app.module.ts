import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { CardModule } from 'primeng/card';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ButtonModule } from 'primeng/button';

import { AppComponent } from './app.component'; // Main component
import { appConfig } from './app.config'; // Import your appConfig
import { routes } from './app.routes'; // Routing (optional if already provided in app.config)

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    ButtonModule
  ],
  providers: [
    ...appConfig.providers
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
