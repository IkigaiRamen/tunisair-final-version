import { Component, ElementRef } from '@angular/core';
import { AppMenu } from './app.menu';

@Component({
    selector: 'app-sidebar',
    standalone: true,
    imports: [AppMenu],
    template: ` 
    <div class="layout-sidebar">
        <div class="sidebar-header">
            <img src="assets/images/Tunisair.png" alt="Tunisair Logo" class="logo" />
            <h1 class="company-name">Tunisair</h1>
        </div>
        <app-menu></app-menu>
    </div>`,
    styles: [`
        :host ::ng-deep {
            .layout-sidebar {
                background: linear-gradient(180deg, var(--surface-0) 0%, var(--surface-50) 100%);
                border-right: 1px solid var(--surface-200);
                box-shadow: 0 0 15px rgba(0,0,0,0.05);
                transition: all 0.3s ease;
            }

            .sidebar-header {
                padding: 1.5rem;
                display: flex;
                align-items: center;
                gap: 1rem;
                border-bottom: 1px solid var(--surface-200);
                background: var(--surface-0);

                .logo {
                    width: 40px;
                    height: 40px;
                    object-fit: contain;
                }

                .company-name {
                    font-size: 1.5rem;
                    font-weight: 600;
                    color: var(--primary-color);
                    margin: 0;
                }
            }

            .layout-menu {
                padding: 1rem 0;
                
                .layout-menuitem-root-text {
                    color: var(--text-color-secondary);
                    font-size: 0.875rem;
                    font-weight: 600;
                    text-transform: uppercase;
                    padding: 0.75rem 1.5rem;
                    margin-top: 0.5rem;
                }

                .layout-menuitem {
                    padding: 0.5rem 1.5rem;
                    transition: all 0.3s ease;

                    &:hover {
                        background-color: var(--surface-50);
                    }

                    &.active-route {
                        background-color: var(--primary-50);
                        border-left: 4px solid var(--primary-color);
                    }

                    .layout-menuitem-icon {
                        color: var(--text-color-secondary);
                        margin-right: 0.5rem;
                        font-size: 1rem;
                    }

                    .layout-menuitem-text {
                        color: var(--text-color);
                        font-size: 0.875rem;
                    }

                    .layout-submenu-toggler {
                        color: var(--text-color-secondary);
                        transition: transform 0.3s ease;
                    }

                    &.active-route {
                        .layout-menuitem-icon,
                        .layout-menuitem-text {
                            color: var(--primary-color);
                        }
                    }
                }
            }
        }
    `]
})
export class AppSidebar {
    constructor(public el: ElementRef) {}
}
