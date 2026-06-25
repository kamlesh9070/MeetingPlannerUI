import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { UserDto } from '../shared/models/index';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {
  profileForm: FormGroup;
  currentUser: UserDto | null = null;
  avatarPreview: string | null = null;
  selectedFile: File | null = null;
  isLoading = false;
  isUploading = false;
  successMessage: string | null = null;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private userService: UserService
  ) {
    this.profileForm = this.fb.group({
      username: [{ value: '', disabled: true }],
      email: [{ value: '', disabled: true }]
    });
  }

  ngOnInit(): void {
    this.loadUserProfile();
  }

  loadUserProfile(): void {
    this.isLoading = true;
    this.currentUser = this.authService.currentUser;
    
    if (this.currentUser) {
      this.profileForm.patchValue({
        username: this.currentUser.username,
        email: this.currentUser.email
      });
      this.avatarPreview = this.currentUser.avatarUrl || null;
    }
    this.isLoading = false;
  }

  onFileSelected(event: any): void {
    const file: File = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      
      // Show preview
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.avatarPreview = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  uploadAvatar(): void {
    if (!this.selectedFile) {
      this.errorMessage = 'Please select a file first';
      return;
    }

    this.isUploading = true;
    this.errorMessage = null;
    this.successMessage = null;

    this.userService.uploadAvatar(this.selectedFile).subscribe({
      next: (user) => {
        this.isUploading = false;
        this.currentUser = user;
        this.authService.updateUser(user);
        this.successMessage = 'Avatar uploaded successfully!';
        this.selectedFile = null;
        
        // Clear success message after 3 seconds
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (error) => {
        this.isUploading = false;
        this.errorMessage = error.message || 'Failed to upload avatar';
      }
    });
  }

  removeAvatar(): void {
    this.avatarPreview = null;
    this.selectedFile = null;
  }
}
