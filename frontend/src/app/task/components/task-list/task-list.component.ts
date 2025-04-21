import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../../user/services/user.service';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { User } from '../../../user/models/user.model';

@Component({
  selector: 'app-task-list',
  templateUrl: './task-list.component.html',
  styleUrls: ['./task-list.component.scss'],
  providers: [MessageService]
})
export class TaskListComponent implements OnInit {
  tasks: Task[] = [];
  users: User[] = [];
  loading = false;
  totalRecords = 0;
  first = 0;
  rows = 10;
  
  // Filter properties
  statusFilter: string | null = null;
  priorityFilter: string | null = null;
  assigneeFilter: number | null = null;
  dateRangeFilter: Date[] | null = null;
  
  // Available filter options
  statuses = Object.values(TaskStatus);
  priorities = Object.values(TaskPriority);
  
  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private messageService: MessageService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
    this.loadTasks();
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
      }
    });
  }

  loadTasks(): void {
    this.loading = true;
    
    // Apply filters if they exist
    if (this.statusFilter) {
      this.taskService.getTasksByStatus(this.statusFilter).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.totalRecords = tasks.length;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tasks'
          });
          this.loading = false;
        }
      });
    } else if (this.priorityFilter) {
      this.taskService.getTasksByPriority(this.priorityFilter).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.totalRecords = tasks.length;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tasks'
          });
          this.loading = false;
        }
      });
    } else if (this.assigneeFilter) {
      this.taskService.getTasksByAssignee(this.assigneeFilter).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.totalRecords = tasks.length;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tasks'
          });
          this.loading = false;
        }
      });
    } else if (this.dateRangeFilter && this.dateRangeFilter.length === 2) {
      this.taskService.getTasksByDateRange(this.dateRangeFilter[0], this.dateRangeFilter[1]).subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.totalRecords = tasks.length;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tasks'
          });
          this.loading = false;
        }
      });
    } else {
      // Load all tasks if no filters are applied
      this.taskService.getAllTasks().subscribe({
        next: (tasks) => {
          this.tasks = tasks;
          this.totalRecords = tasks.length;
          this.loading = false;
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to load tasks'
          });
          this.loading = false;
        }
      });
    }
  }

  applyFilters(): void {
    this.loadTasks();
  }

  clearFilters(): void {
    this.statusFilter = null;
    this.priorityFilter = null;
    this.assigneeFilter = null;
    this.dateRangeFilter = null;
    this.loadTasks();
  }

  onPageChange(event: any): void {
    this.first = event.first;
    this.rows = event.rows;
    // In a real implementation, you would load the specific page from the backend
  }

  viewTask(taskId: number): void {
    this.router.navigate(['/tasks', taskId]);
  }

  editTask(taskId: number): void {
    this.router.navigate(['/tasks', taskId, 'edit']);
  }

  deleteTask(taskId: number): void {
    this.taskService.deleteTask(taskId).subscribe({
      next: () => {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task deleted successfully'
        });
        this.loadTasks();
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to delete task'
        });
      }
    });
  }

  createNewTask(): void {
    this.router.navigate(['/tasks/new']);
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
        return 'secondary';
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
      case TaskPriority.URGENT:
        return 'danger';
      default:
        return 'secondary';
    }
  }

  getAssigneeName(task: Task): string {
    if (task.assignee) {
      return `${task.assignee.firstName} ${task.assignee.lastName}`;
    }
    return 'Unassigned';
  }
} 