import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ValidationMapperService } from '../shared/services/validation-mapper.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private validationMapper: ValidationMapperService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  submit() {
    if (this.loginForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.authService.login(this.loginForm.value).subscribe({
        next: (user) => {
          this.isLoading = false;
          console.log('Login successful', user);
          this.router.navigate(['/dashboard']);
        },
        error: (error) => {
          this.isLoading = false;
          const mapped = this.validationMapper.getMessage(error?.errorCode);
          this.errorMessage = mapped || this.formatApiError(error) || 'Login failed. Please try again.';
          console.error('Login error', error);
        }
      });
    }
  }

  private formatApiError(err: any): string {
    if (!err) return '';
    if (err.details && typeof err.details === 'object') {
      const parts = Object.entries(err.details).map(([k, v]) => `${k}: ${v}`);
      return `${err.message} — ${parts.join('; ')}`;
    }
    return err.message || String(err);
  }
}
