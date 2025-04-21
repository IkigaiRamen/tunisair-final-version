import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { Subject, takeUntil } from 'rxjs';
import { TaskService } from '../../services/task.service';
import { UserService } from '../../../user/services/user.service';
import { DecisionService } from '../../../decision/services/decision.service';
import { Task, TaskPriority, TaskStatus } from '../../models/task.model';
import { User } from '../../../user/models/user.model';
import { Decision } from '../../../decision/models/decision.model';

@Component({
  selector: 'app-task-form',
  templateUrl: './task-form.component.html',
  styleUrls: ['./task-form.component.scss'],
  providers: [MessageService]
})
export class TaskFormComponent implements OnInit, OnDestroy {
  taskForm: FormGroup;
  isEditMode = false;
  taskId: number | null = null;
  loading = false;
  submitting = false;
  
  users: User[] = [];
  decisions: Decision[] = [];
  
  statuses = Object.values(TaskStatus);
  priorities = Object.values(TaskPriority);
  
  private destroy$ = new Subject<void>();
  
  constructor(
    private fb: FormBuilder,
    private taskService: TaskService,
    private userService: UserService,
    private decisionService: DecisionService,
    private messageService: MessageService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.taskForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', Validators.required],
      status: [TaskStatus.PENDING, Validators.required],
      priority: [TaskPriority.MEDIUM, Validators.required],
      dueDate: [null, Validators.required],
      assignee: [null, Validators.required],
      decision: [null, Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    this.loadDecisions();
    
    // Check if we're in edit mode
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.taskId = +params['id'];
        this.loadTask(this.taskId);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAllUsers().pipe(takeUntil(this.destroy$)).subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load users'
        });
        this.loading = false;
      }
    });
  }

  loadDecisions(): void {
    this.loading = true;
    this.decisionService.getAllDecisions().pipe(takeUntil(this.destroy$)).subscribe({
      next: (decisions) => {
        this.decisions = decisions;
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load decisions'
        });
        this.loading = false;
      }
    });
  }

  loadTask(id: number): void {
    this.loading = true;
    this.taskService.getTaskById(id).pipe(takeUntil(this.destroy$)).subscribe({
      next: (task) => {
        // Format dates for the form
        const formattedTask = {
          ...task,
          dueDate: new Date(task.dueDate)
        };
        
        this.taskForm.patchValue(formattedTask);
        this.loading = false;
      },
      error: (error) => {
        this.messageService.add({
          severity: 'error',
          summary: 'Error',
          detail: 'Failed to load task'
        });
        this.loading = false;
        this.router.navigate(['/tasks']);
      }
    });
  }

  onSubmit(): void {
    if (this.taskForm.invalid) {
      this.markFormGroupTouched(this.taskForm);
      return;
    }
    
    this.submitting = true;
    const taskData = this.taskForm.value;
    
    if (this.isEditMode && this.taskId) {
      this.taskService.updateTask(this.taskId, taskData).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task updated successfully'
          });
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to update task'
          });
          this.submitting = false;
        }
      });
    } else {
      this.taskService.createTask(taskData).pipe(takeUntil(this.destroy$)).subscribe({
        next: () => {
          this.messageService.add({
            severity: 'success',
            summary: 'Success',
            detail: 'Task created successfully'
          });
          this.router.navigate(['/tasks']);
        },
        error: (error) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Failed to create task'
          });
          this.submitting = false;
        }
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/tasks']);
  }

  private markFormGroupTouched(formGroup: FormGroup): void {
    Object.values(formGroup.controls).forEach(control => {
      control.markAsTouched();
      
      if (control instanceof FormGroup) {
        this.markFormGroupTouched(control);
      }
    });
  }
} 