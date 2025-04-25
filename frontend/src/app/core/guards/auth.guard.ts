import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard {
    constructor(private authService: AuthService, private router: Router) {}

    canActivate(): boolean {
        const token = this.authService.getToken();
        if (token) {
            return true;
        }
        
        this.router.navigate(['/auth/login']);
        return false;
    }
} 