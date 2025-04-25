import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChartModule } from 'primeng/chart';
import { CalendarModule } from 'primeng/calendar';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { TasksService } from '../../core/services/tasks.service';
import { ReportService } from '../../core/services/report.service';

@Component({
    selector: 'app-task-progress',
    standalone: true,
    imports: [
        CommonModule,
        FormsModule,
        ButtonModule,
        CardModule,
        ChartModule,
        CalendarModule,
        ToastModule
    ],
    template: `
        <div class="grid grid-cols-12 gap-8">
            <!-- Summary Cards -->
            <div class="col-span-12 md:col-span-3">
                <p-card>
                    <ng-template pTemplate="header">
                        <div class="text-center p-4 bg-primary-50">
                            <i class="pi pi-clock text-4xl text-primary-500"></i>
                        </div>
                    </ng-template>
                    <div class="text-center">
                        <h3 class="text-xl font-bold mb-2">Pending Tasks</h3>
                        <p class="text-3xl font-bold text-primary-500">{{ pendingTasks }}</p>
                    </div>
                </p-card>
            </div>
            <div class="col-span-12 md:col-span-3">
                <p-card>
                    <ng-template pTemplate="header">
                        <div class="text-center p-4 bg-info-50">
                            <i class="pi pi-sync text-4xl text-info-500"></i>
                        </div>
                    </ng-template>
                    <div class="text-center">
                        <h3 class="text-xl font-bold mb-2">In Progress</h3>
                        <p class="text-3xl font-bold text-info-500">{{ inProgressTasks }}</p>
                    </div>
                </p-card>
            </div>
            <div class="col-span-12 md:col-span-3">
                <p-card>
                    <ng-template pTemplate="header">
                        <div class="text-center p-4 bg-success-50">
                            <i class="pi pi-check-circle text-4xl text-success-500"></i>
                        </div>
                    </ng-template>
                    <div class="text-center">
                        <h3 class="text-xl font-bold mb-2">Completed</h3>
                        <p class="text-3xl font-bold text-success-500">{{ completedTasks }}</p>
                    </div>
                </p-card>
            </div>
            <div class="col-span-12 md:col-span-3">
                <p-card>
                    <ng-template pTemplate="header">
                        <div class="text-center p-4 bg-warning-50">
                            <i class="pi pi-calendar text-4xl text-warning-500"></i>
                        </div>
                    </ng-template>
                    <div class="text-center">
                        <h3 class="text-xl font-bold mb-2">Overdue</h3>
                        <p class="text-3xl font-bold text-warning-500">{{ overdueTasks }}</p>
                    </div>
                </p-card>
            </div>

            <!-- Charts -->
            <div class="col-span-12 md:col-span-6">
                <p-card header="Task Status Distribution">
                    <p-chart type="pie" [data]="statusChartData" [options]="chartOptions"></p-chart>
                </p-card>
            </div>
            <div class="col-span-12 md:col-span-6">
                <p-card header="Task Completion Trend">
                    <p-chart type="line" [data]="trendChartData" [options]="chartOptions"></p-chart>
                </p-card>
            </div>

            <!-- Export Options -->
            <div class="col-span-12">
                <p-card>
                    <div class="flex justify-between items-center">
                        <h2 class="text-2xl font-bold">Export Reports</h2>
                        <div class="flex gap-2">
                            <p-button icon="pi pi-download" label="Export PDF" (onClick)="exportPDF()" />
                            <p-button icon="pi pi-download" label="Export Excel" (onClick)="exportExcel()" />
                        </div>
                    </div>
                </p-card>
            </div>
        </div>
    `,
    providers: [MessageService, TasksService, ReportService]
})
export class TaskProgressComponent implements OnInit {
    pendingTasks = 0;
    inProgressTasks = 0;
    completedTasks = 0;
    overdueTasks = 0;

    statusChartData: any;
    trendChartData: any;
    chartOptions: any;

    constructor(
        private tasksService: TasksService,
        private reportService: ReportService,
        private messageService: MessageService
    ) {
        this.chartOptions = {
            plugins: {
                legend: {
                    position: 'bottom'
                }
            }
        };
    }

    ngOnInit() {
        this.loadTaskStatistics();
        this.initCharts();
    }

    loadTaskStatistics() {
        this.tasksService.list().subscribe({
            next: (tasks) => {
                this.pendingTasks = tasks.filter(t => t.status === 'PENDING').length;
                this.inProgressTasks = tasks.filter(t => t.status === 'IN_PROGRESS').length;
                this.completedTasks = tasks.filter(t => t.status === 'COMPLETED').length;
                this.overdueTasks = tasks.filter(t => this.isOverdue(t)).length;
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to load task statistics'
                });
            }
        });
    }

    initCharts() {
        // Status Distribution Chart
        this.statusChartData = {
            labels: ['Pending', 'In Progress', 'Completed', 'Overdue'],
            datasets: [
                {
                    data: [this.pendingTasks, this.inProgressTasks, this.completedTasks, this.overdueTasks],
                    backgroundColor: ['#FFA726', '#29B6F6', '#66BB6A', '#EF5350']
                }
            ]
        };

        // Completion Trend Chart
        this.trendChartData = {
            labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
            datasets: [
                {
                    label: 'Completed Tasks',
                    data: [12, 15, 18, 14, 20, 25],
                    borderColor: '#66BB6A',
                    tension: 0.4
                },
                {
                    label: 'New Tasks',
                    data: [15, 18, 20, 16, 22, 28],
                    borderColor: '#29B6F6',
                    tension: 0.4
                }
            ]
        };
    }

    isOverdue(task: any): boolean {
        if (task.status === 'COMPLETED') return false;
        const deadline = new Date(task.deadline);
        return deadline < new Date();
    }

    exportPDF() {
        this.reportService.generate('pdf').subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'task-progress.pdf';
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to generate PDF report'
                });
            }
        });
    }

    exportExcel() {
        this.reportService.generate('excel').subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.download = 'task-progress.xlsx';
                link.click();
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                this.messageService.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to generate Excel report'
                });
            }
        });
    }
} 