import { Component, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Task, TaskStatus, TaskPriority } from '../../models/task.model';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../../user/services/user.service';
import { User } from '../../../user/models/user.model';

@Component({
  selector: 'app-task-dashboard',
  templateUrl: './task-dashboard.component.html',
  styleUrls: ['./task-dashboard.component.scss'],
  providers: [MessageService]
})
export class TaskDashboardComponent implements OnInit {
  tasks: Task[] = [];
  users: User[] = [];
  loading = false;
  selectedStatus: TaskStatus | null = null;
  selectedPriority: TaskPriority | null = null;
  selectedAssignee: number | null = null;
  dateRange: Date[] = [];

  constructor(
    private taskService: TaskService,
    private userService: UserService,
    private messageService: MessageService
  ) { }

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
    if (this.dateRange.length === 2) {
      this.taskService.getTasksByDateRange(this.dateRange[0], this.dateRange[1]).subscribe({
        next: (tasks) => {
          this.tasks = this.filterTasks(tasks);
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
      this.taskService.getTasksByAssignee(this.selectedAssignee || 0).subscribe({
        next: (tasks) => {
          this.tasks = this.filterTasks(tasks);
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

  filterTasks(tasks: Task[]): Task[] {
    return tasks.filter(task => {
      const statusMatch = !this.selectedStatus || task.status === this.selectedStatus;
      const priorityMatch = !this.selectedPriority || task.priority === this.selectedPriority;
      const assigneeMatch = !this.selectedAssignee || task.assignee.id === this.selectedAssignee;
      return statusMatch && priorityMatch && assigneeMatch;
    });
  }

  updateTaskStatus(task: Task, status: TaskStatus): void {
    this.taskService.updateTaskStatus(task.id, status).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task status updated successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task status'
        });
      }
    });
  }

  updateTaskPriority(task: Task, priority: TaskPriority): void {
    this.taskService.updateTaskPriority(task.id, priority).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task priority updated successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to update task priority'
        });
      }
    });
  }

  assignTask(task: Task, assigneeId: number): void {
    this.taskService.assignTask(task.id, assigneeId).subscribe({
      next: (updatedTask) => {
        const index = this.tasks.findIndex(t => t.id === task.id);
        if (index !== -1) {
          this.tasks[index] = updatedTask;
        }
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Task assigned successfully'
        });
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to assign task'
        });
      }
    });
  }

  onFilterChange(): void {
    this.loadTasks();
  }
} 