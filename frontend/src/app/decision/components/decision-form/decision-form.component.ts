import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DecisionService } from '../../services/decision.service';
import { UserService } from '../../../user/services/user.service';
import { MessageService } from 'primeng/api';
import { Decision, DecisionStatus } from '../../models/decision.model';
import { User } from '../../../user/models/user.model';

@Component({
  selector: 'app-decision-form',
  templateUrl: './decision-form.component.html',
  styleUrls: ['./decision-form.component.scss'],
  providers: [MessageService]
})
export class DecisionFormComponent implements OnInit {
  @Input() decision?: Decision;
  @Input() meetingId?: number;
  @Output() decisionSaved = new EventEmitter<Decision>();
  @Output() cancel = new EventEmitter<void>();

  decisionForm: FormGroup;
  users: User[] = [];
  loading = false;
  statuses = Object.values(DecisionStatus);

  constructor(
    private fb: FormBuilder,
    private decisionService: DecisionService,
    private userService: UserService,
    private messageService: MessageService
  ) {
    this.decisionForm = this.fb.group({
      title: ['', Validators.required],
      description: ['', Validators.required],
      status: [DecisionStatus.PENDING, Validators.required],
      proposerId: [null, Validators.required],
      meetingId: [null]
    });
  }

  ngOnInit(): void {
    this.loadUsers();
    if (this.decision) {
      this.decisionForm.patchValue({
        title: this.decision.title,
        description: this.decision.description,
        status: this.decision.status,
        proposerId: this.decision.proposer.id,
        meetingId: this.decision.meetingId
      });
    } else if (this.meetingId) {
      this.decisionForm.patchValue({ meetingId: this.meetingId });
    }
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

  onSubmit(): void {
    if (this.decisionForm.valid) {
      this.loading = true;
      const decisionData = this.decisionForm.value;

      if (this.decision) {
        this.decisionService.updateDecision(this.decision.id, decisionData).subscribe({
          next: (updatedDecision) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Decision updated successfully'
            });
            this.decisionSaved.emit(updatedDecision);
            this.loading = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to update decision'
            });
            this.loading = false;
          }
        });
      } else {
        this.decisionService.createDecision(decisionData).subscribe({
          next: (newDecision) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Success',
              detail: 'Decision created successfully'
            });
            this.decisionSaved.emit(newDecision);
            this.loading = false;
          },
          error: (error) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Failed to create decision'
            });
            this.loading = false;
          }
        });
      }
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
} 