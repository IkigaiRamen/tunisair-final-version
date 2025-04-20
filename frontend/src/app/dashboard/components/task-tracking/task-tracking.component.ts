import { Component, OnInit } from '@angular/core';
import { TaskService } from '../../../task/services/task.service';
import { Task } from '../../../task/models/task.model';
import { TaskStatus } from '../../../task/models/task-status.enum';
import { TaskPriority } from '../../../task/models/task-priority.enum';

@Component({
  selector: 'app-task-tracking',
  templateUrl: './task-tracking.component.html',
  styleUrls: ['./task-tracking.component.scss']
})
export class TaskTrackingComponent implements OnInit {
  tasks: Task[] = [];
  loading = true;
  statusChartData: any;
  priorityChartData: any;
  chartOptions: any;

  constructor(private taskService: TaskService) {
    this.chartOptions = {
      plugins: {
        legend: {
          position: 'bottom'
        }
      }
    };
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  loadTasks(): void {
    this.loading = true;
    this.taskService.getAllTasks().subscribe({
      next: (tasks) => {
        this.tasks = tasks;
        this.initializeCharts();
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading tasks:', error);
        this.loading = false;
      }
    });
  }

  private initializeCharts(): void {
    // Status distribution chart
    const statusCounts = this.getStatusDistribution();
    this.statusChartData = {
      labels: Object.keys(statusCounts),
      datasets: [{
        data: Object.values(statusCounts),
        backgroundColor: [
          '#FFC107', // Pending
          '#17A2B8', // In Progress
          '#28A745', // Completed
          '#DC3545'  // Cancelled
        ]
      }]
    };

    // Priority distribution chart
    const priorityCounts = this.getPriorityDistribution();
    this.priorityChartData = {
      labels: Object.keys(priorityCounts),
      datasets: [{
        data: Object.values(priorityCounts),
        backgroundColor: [
          '#6C757D', // Low
          '#FFC107', // Medium
          '#DC3545'  // High
        ]
      }]
    };
  }

  private getStatusDistribution(): { [key: string]: number } {
    const distribution: { [key: string]: number } = {};
    Object.values(TaskStatus).forEach(status => {
      distribution[status] = this.tasks.filter(task => task.status === status).length;
    });
    return distribution;
  }

  private getPriorityDistribution(): { [key: string]: number } {
    const distribution: { [key: string]: number } = {};
    Object.values(TaskPriority).forEach(priority => {
      distribution[priority] = this.tasks.filter(task => task.priority === priority).length;
    });
    return distribution;
  }

  getStatusSeverity(status: TaskStatus): string {
    switch (status) {
      case TaskStatus.PENDING:
        return 'warning';
      case TaskStatus.IN_PROGRESS:
        return 'info';
      case TaskStatus.COMPLETED:
        return 'success';
      case TaskStatus.CANCELLED:
        return 'danger';
      default:
        return 'info';
    }
  }

  getPrioritySeverity(priority: TaskPriority): string {
    switch (priority) {
      case TaskPriority.LOW:
        return 'info';
      case TaskPriority.MEDIUM:
        return 'warning';
      case TaskPriority.HIGH:
        return 'danger';
      default:
        return 'info';
    }
  }
} 