import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { ValidationMapperService } from '../shared/services/validation-mapper.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent {
  signupForm: FormGroup;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private validationMapper: ValidationMapperService
  ) {
    this.signupForm = this.fb.group({
      username: ['', Validators.required],
      displayName: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]]
    });
  }

  submit() {
    if (this.signupForm.valid) {
      this.isLoading = true;
      this.errorMessage = null;
      this.authService.signup(this.signupForm.value).subscribe({
        next: (user) => {
          this.isLoading = false;
          console.log('Signup successful', user);
          this.router.navigate(['/dashboard']);
        },
        error: (err) => {
          this.isLoading = false;
          const mapped = this.validationMapper.getMessage(err?.errorCode);
          this.errorMessage = mapped || this.formatApiError(err) || 'Signup failed';
          console.error('Signup error', err);
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
