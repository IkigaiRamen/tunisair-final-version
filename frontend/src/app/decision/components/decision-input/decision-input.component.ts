import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MessageService } from 'primeng/api';
import { Decision, DecisionStatus } from '../../models/decision.model';
import { DecisionService } from '../../services/decision.service';
import { Meeting } from '../../../meeting/models/meeting.model';
import { User } from '../../../user/models/user.model';

@Component({
  selector: 'app-decision-input',
  templateUrl: './decision-input.component.html',
  styleUrls: ['./decision-input.component.scss'],
  providers: [MessageService]
})
export class DecisionInputComponent {
  @Input() meeting!: Meeting;
  @Input() currentUser!: User;
  @Output() decisionCreated = new EventEmitter<Decision>();

  decisionForm: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private decisionService: DecisionService,
    private messageService: MessageService
  ) {
    this.decisionForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  onSubmit(): void {
    if (this.decisionForm.invalid) {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Please fill in all required fields correctly'
      });
      return;
    }

    this.loading = true;
    const decision: Partial<Decision> = {
      ...this.decisionForm.value,
      meeting: this.meeting,
      proposer: this.currentUser,
      status: DecisionStatus.PENDING
    };

    this.decisionService.createDecision(decision).subscribe({
      next: (newDecision) => {
        this.decisionCreated.emit(newDecision);
        this.decisionForm.reset();
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Decision created successfully'
        });
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