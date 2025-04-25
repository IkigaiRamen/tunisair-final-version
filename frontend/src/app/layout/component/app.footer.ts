import { Component } from '@angular/core';

@Component({
    standalone: true,
    selector: 'app-footer',
    template: `
      <footer class="layout-footer surface-100 text-center p-3 border-top-1 surface-border">
        <div class="text-sm text-color-secondary">
          <b class="text-primary">Tunisair</b> &copy; {{ currentYear }}. All rights reserved.
        </div>
      </footer>
    `,
    styles: [`
      .layout-footer {
        width: 100%;
        bottom: 0;
        left: 0;
      }
    `]
  })
  export class AppFooter {
    currentYear: number = new Date().getFullYear();
  }
  
