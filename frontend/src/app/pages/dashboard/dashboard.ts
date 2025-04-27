import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { DividerModule } from 'primeng/divider';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';

@Component({
    selector: 'app-dashboard',
    standalone: true,
    imports: [CommonModule, CardModule, DividerModule, RippleModule, ButtonModule],
    template: `
        <div class="flex flex-col">
            <!-- Hero Section -->
            <div class="card bg-gradient-to-r from-surface-0 to-surface-50 mb-4">
                <div class="flex flex-column align-items-center text-center p-5">
                    <div class="flex align-items-center justify-content-center bg-primary border-circle mb-4" style="width:5rem;height:5rem">
                    </div>
                    <h1 class="text-4xl font-bold m-0 mb-3 text-surface-900">Tunisair Meeting Management</h1>
                    <p class="text-xl text-surface-600 m-0 mb-4">Streamlining corporate meetings and decision-making processes</p>
                    <p class="text-surface-600 m-0 max-w-3rem line-height-3">A comprehensive solution for managing meetings, decisions, and tasks across Tunisair's organization</p>
                </div>
            </div>

            <!-- Features Section -->
            <div class="card bg-gradient-to-r from-surface-0 to-surface-50 mb-4">
                <div class="grid">
                    <div class="col-12 md:col-4">
                        <div class="feature-card">
                            <div class="flex flex-column align-items-center text-center p-4">
                                <div class="flex align-items-center justify-content-center bg-blue-100 border-circle mb-4" style="width:4rem;height:4rem">
                                </div>
                                <h3 class="text-xl font-bold m-0 mb-3 text-surface-900">Meeting Management</h3>
                                <p class="text-surface-600 m-0 mb-4">Efficiently schedule, organize, and track meetings across departments</p>
                                <ul class="text-left mt-3 mb-0 list-none p-0 w-full">
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Calendar integration</span>
                                    </li>
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Participant management</span>
                                    </li>
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Agenda creation</span>
                                    </li>
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Meeting minutes</span>
                                    </li>
                                    <li class="flex align-items-center">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Location management</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-4">
                        <div class="feature-card">
                            <div class="flex flex-column align-items-center text-center p-4">
                                <div class="flex align-items-center justify-content-center bg-green-100 border-circle mb-4" style="width:4rem;height:4rem">
                                </div>
                                <h3 class="text-xl font-bold m-0 mb-3 text-surface-900">Decision Tracking</h3>
                                <p class="text-surface-600 m-0 mb-4">Track and manage decisions made during meetings</p>
                                <ul class="text-left mt-3 mb-0 list-none p-0 w-full">
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Decision recording</span>
                                    </li>
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Responsibility assignment</span>
                                    </li>
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Deadline tracking</span>
                                    </li>
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Status monitoring</span>
                                    </li>
                                    <li class="flex align-items-center">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Follow-up reminders</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    <div class="col-12 md:col-4">
                        <div class="feature-card">
                            <div class="flex flex-column align-items-center text-center p-4">
                                <div class="flex align-items-center justify-content-center bg-purple-100 border-circle mb-4" style="width:4rem;height:4rem">
                                </div>
                                <h3 class="text-xl font-bold m-0 mb-3 text-surface-900">Document Management</h3>
                                <p class="text-surface-600 m-0 mb-4">Organize and manage meeting-related documents</p>
                                <ul class="text-left mt-3 mb-0 list-none p-0 w-full">
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Document upload</span>
                                    </li>
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Version control</span>
                                    </li>
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Access control</span>
                                    </li>
                                    <li class="flex align-items-center mb-3">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Search functionality</span>
                                    </li>
                                    <li class="flex align-items-center">
                                        <i class="pi pi-check-circle text-green-500 mr-2"></i>
                                        <span class="text-surface-700">Document sharing</span>
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Benefits Section -->
            <div class="card bg-gradient-to-r from-surface-0 to-surface-50 mb-4">
                <h2 class="text-2xl font-bold text-center mb-5 text-surface-900">Benefits</h2>
                <div class="grid">
                    <div class="col-12 md:col-3">
                        <div class="benefit-card">
                            <div class="flex flex-column align-items-center text-center p-4">
                                <div class="flex align-items-center justify-content-center bg-yellow-100 border-circle mb-4" style="width:4rem;height:4rem">
                                </div>
                                <h4 class="text-lg font-bold m-0 mb-3 text-surface-900">Time Efficiency</h4>
                                <p class="text-surface-600 m-0 line-height-3">Reduce time spent on meeting organization and follow-up tasks</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 md:col-3">
                        <div class="benefit-card">
                            <div class="flex flex-column align-items-center text-center p-4">
                                <div class="flex align-items-center justify-content-center bg-blue-100 border-circle mb-4" style="width:4rem;height:4rem">
                                </div>
                                <h4 class="text-lg font-bold m-0 mb-3 text-surface-900">Improved Productivity</h4>
                                <p class="text-surface-600 m-0 line-height-3">Better tracking of decisions and tasks leads to higher productivity</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 md:col-3">
                        <div class="benefit-card">
                            <div class="flex flex-column align-items-center text-center p-4">
                                <div class="flex align-items-center justify-content-center bg-green-100 border-circle mb-4" style="width:4rem;height:4rem">
                                </div>
                                <h4 class="text-lg font-bold m-0 mb-3 text-surface-900">Better Collaboration</h4>
                                <p class="text-surface-600 m-0 line-height-3">Enhanced communication and collaboration across departments</p>
                            </div>
                        </div>
                    </div>
                    <div class="col-12 md:col-3">
                        <div class="benefit-card">
                            <div class="flex flex-column align-items-center text-center p-4">
                                <div class="flex align-items-center justify-content-center bg-red-100 border-circle mb-4" style="width:4rem;height:4rem">
                                </div>
                                <h4 class="text-lg font-bold m-0 mb-3 text-surface-900">Enhanced Security</h4>
                                <p class="text-surface-600 m-0 line-height-3">Secure storage and access control for sensitive information</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <!-- About Section -->
            <div class="card bg-gradient-to-r from-surface-0 to-surface-50">
                <div class="flex flex-column align-items-center text-center p-5">
                    <h2 class="text-2xl font-bold mb-4 text-surface-900">About the Application</h2>
                    <p class="text-surface-600 m-0 max-w-3rem line-height-3">
                        The Tunisair Meeting Management application is designed to streamline the meeting process, 
                        from scheduling to follow-up. It helps teams stay organized, track decisions, and ensure 
                        that important tasks are completed on time. The application is built with modern technology 
                        and follows best practices in user experience and security.
                    </p>
                </div>
            </div>
        </div>
    `,
    styles: [`
        :host ::ng-deep {
            .card {
                @apply border border-surface-200 rounded-lg shadow-sm;
            }

            .feature-card {
                @apply p-6 border border-surface-200 bg-surface-0 rounded-lg shadow-sm;
                transition: all 0.3s ease;
                &:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border-color: var(--primary-color);
                }
            }

            .benefit-card {
                @apply p-6 border border-surface-200 bg-surface-0 rounded-lg shadow-sm;
                transition: all 0.3s ease;
                &:hover {
                    transform: translateY(-5px);
                    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
                    border-color: var(--primary-color);
                }
            }

            .border-circle {
                transition: transform 0.2s;
                &:hover {
                    transform: scale(1.1);
                }
            }

            .bg-gradient-to-r {
                background-image: linear-gradient(to right, var(--surface-0), var(--surface-50));
            }

            .grid {
                margin: 0;
            }

            .col-12 {
                padding: 0.5rem;
            }

            @media screen and (max-width: 768px) {
                .col-12 {
                    padding: 0.25rem;
                }
            }
        }
    `]
})
export class Dashboard {}
