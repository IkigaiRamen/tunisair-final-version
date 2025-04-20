import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  template: `
    <div class="layout-wrapper">
      <app-header></app-header>
      <div class="layout-main">
        <router-outlet></router-outlet>
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styles: [`
    .layout-wrapper {
      min-height: 100vh;
      display: flex;
      flex-direction: column;
    }
    .layout-main {
      flex: 1;
      padding: 2rem;
    }
  `]
})
export class AppComponent {
  title = 'Tunisair Meeting Management';
} 