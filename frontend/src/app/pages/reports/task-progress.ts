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
import { Task } from '../../core/models/task.model';

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
                        <div class="text-center p-4 bg-blue-50">
                            <i class="pi pi-sync text-4xl text-info-500"></i>
                        </div>
                    </ng-template>
                    <div class="text-center">
                        <h3 class="text-xl font-bold mb-2">In Progress</h3>
                        <p class="text-3xl font-bold text-blue-500">{{ inProgressTasks }}</p>
                    </div>
                </p-card>
            </div>
            <div class="col-span-12 md:col-span-3">
                <p-card>
                    <ng-template pTemplate="header">
                        <div class="text-center p-4 bg-green-50">
                            <i class="pi pi-check-circle text-4xl text-success-500"></i>
                        </div>
                    </ng-template>
                    <div class="text-center">
                        <h3 class="text-xl font-bold mb-2">Completed</h3>
                        <p class="text-3xl font-bold text-green-500">{{ completedTasks }}</p>
                    </div>
                </p-card>
            </div>
            <div class="col-span-12 md:col-span-3">
                <p-card>
                    <ng-template pTemplate="header">
                        <div class="text-center p-4 bg-yellow-50">
                            <i class="pi pi-calendar text-4xl text-warning-500"></i>
                        </div>
                    </ng-template>
                    <div class="text-center">
                        <h3 class="text-xl font-bold mb-2">Overdue</h3>
                        <p class="text-3xl font-bold text-yellow-500">{{ overdueTasks }}</p>
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
    allTasks: Task[] = [];

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
    }

    loadTaskStatistics() {
        this.tasksService.list().subscribe({
            next: (tasks) => {
                this.allTasks = tasks;
                this.updateTaskCounts();
                this.initCharts();
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

    updateTaskCounts() {
        this.pendingTasks = this.allTasks.filter(t => t.status === 'PENDING').length;
        this.inProgressTasks = this.allTasks.filter(t => t.status === 'IN_PROGRESS').length;
        this.completedTasks = this.allTasks.filter(t => t.status === 'COMPLETED').length;
        this.overdueTasks = this.allTasks.filter(t => this.isOverdue(t)).length;
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

        // Completion Trend Chart - Group tasks by month
        const monthlyData = this.calculateMonthlyTaskData();
        this.trendChartData = {
            labels: monthlyData.labels,
            datasets: [
                {
                    label: 'Completed Tasks',
                    data: monthlyData.completed,
                    borderColor: '#66BB6A',
                    tension: 0.4
                },
                {
                    label: 'New Tasks',
                    data: monthlyData.created,
                    borderColor: '#29B6F6',
                    tension: 0.4
                }
            ]
        };
    }

    calculateMonthlyTaskData() {
        const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        const currentDate = new Date();
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(currentDate.getMonth() - 5);

        const monthlyCompleted = new Array(6).fill(0);
        const monthlyCreated = new Array(6).fill(0);
        const labels = [];

        // Generate labels for the last 6 months
        for (let i = 0; i < 6; i++) {
            const date = new Date();
            date.setMonth(currentDate.getMonth() - (5 - i));
            labels.push(months[date.getMonth()]);
        }

        // Count tasks for each month
        this.allTasks.forEach(task => {
            // Use updated_at if created_at is null, otherwise use current date
            const taskDate = task.updatedAt ? new Date(task.updatedAt) : new Date();
            
            if (taskDate >= sixMonthsAgo) {
                const monthIndex = 5 - Math.floor((currentDate.getTime() - taskDate.getTime()) / (30 * 24 * 60 * 60 * 1000));
                if (monthIndex >= 0 && monthIndex < 6) {
                    monthlyCreated[monthIndex]++;
                    if (task.status === 'COMPLETED') {
                        monthlyCompleted[monthIndex]++;
                    }
                }
            }
        });

        return {
            labels,
            completed: monthlyCompleted,
            created: monthlyCreated
        };
    }

    isOverdue(task: Task): boolean {
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