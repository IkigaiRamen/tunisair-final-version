import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../../core/models/user.model';
import { UsersService } from '../../../core/services/users.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss']
})
export class UserListComponent implements OnInit {
  users$!: Observable<User[]>;

  constructor(
    private usersService: UsersService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.users$ = this.usersService.getAll();
  }

  goToNew(): void {
    this.router.navigate(['/users/new']);
  }

  viewUser(id: number): void {
    this.router.navigate(['/users', id]);
  }

  editUser(id: number): void {
    this.router.navigate(['/users', id, 'edit']);
  }

  deleteUser(id: number): void {
    if (confirm('Are you sure you want to delete this user?')) {
      this.usersService.delete(id).subscribe(() => this.loadUsers());
    }
  }
}
