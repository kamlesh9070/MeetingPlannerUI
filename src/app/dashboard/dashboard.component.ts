import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { MeetingService } from '../shared/services/meeting.service';
import { UserDto, MeetingRequest, MeetingResponse } from '../shared/models/index';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  currentUser: UserDto | null = null;
  meetings: MeetingResponse[] = [];
  meetingForm: FormGroup;
  isLoading = false;
  isCreatingMeeting = false;
  errorMessage: string | null = null;
  displayedColumns: string[] = ['title', 'startTime', 'endTime', 'organizerName', 'actions'];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private meetingService: MeetingService,
    private router: Router,
    private fb: FormBuilder
  ) {
    this.meetingForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required],
      participants: [[]]
    });
  }

  ngOnInit(): void {
    this.loadCurrentUser();
  }

  loadCurrentUser(): void {
    const user = this.authService.currentUser;
    if (user) {
      this.currentUser = user;
      this.loadUserProfile();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadUserProfile(): void {
    this.userService.getProfile().subscribe({
      next: (user) => {
        this.currentUser = user;
      },
      error: (error) => {
        console.error('Error loading user profile:', error);
        this.errorMessage = 'Failed to load user profile';
      }
    });
  }

  createMeeting(): void {
    if (this.meetingForm.valid) {
      this.isCreatingMeeting = true;
      this.errorMessage = null;
      this.meetingService.createMeeting(this.meetingForm.value).subscribe({
        next: (meeting) => {
          this.isCreatingMeeting = false;
          this.meetings.push(meeting);
          this.meetingForm.reset();
          console.log('Meeting created:', meeting);
        },
        error: (error) => {
          this.isCreatingMeeting = false;
          this.errorMessage = error.message || 'Failed to create meeting';
          console.error('Error creating meeting:', error);
        }
      });
    }
  }

  viewMeeting(meetingId: string): void {
    this.router.navigate(['/meetings', meetingId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
