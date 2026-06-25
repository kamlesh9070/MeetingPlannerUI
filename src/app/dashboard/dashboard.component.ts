import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { UserService } from '../shared/services/user.service';
import { MeetingService } from '../shared/services/meeting.service';
import { UserDto, MeetingRequest, MeetingResponse } from '../shared/models/index';
import { FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';

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
  displayedColumns: string[] = ['title', 'startTime', 'endTime', 'participants', 'organizerName', 'actions'];

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private meetingService: MeetingService,
    private router: Router,
    private fb: FormBuilder
  ) {
    const today = this.getLocalDateString(new Date());
    const defaultStartTime = '09:00';
    const defaultEndTime = '10:00';

    this.meetingForm = this.fb.group({
      title: ['', Validators.required],
      description: [''],
      startDate: [today, Validators.required],
      startTime: [defaultStartTime, Validators.required],
      endDate: [today, Validators.required],
      endTime: [defaultEndTime, Validators.required],
      participants: this.fb.array([])
    });
  }

  get participants(): FormArray {
    return this.meetingForm.get('participants') as FormArray;
  }

  addParticipant(): void {
    this.participants.push(this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]]
    }));
  }

  removeParticipant(index: number): void {
    this.participants.removeAt(index);
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
      const { title, description, startDate, startTime, endDate, endTime, participants } = this.meetingForm.value;
      const startDateTime = `${startDate}T${startTime}`;
      const endDateTime = `${endDate}T${endTime}`;
      this.meetingService.createMeeting({ title, description, startTime: startDateTime, endTime: endDateTime, participants }).subscribe({
        next: (meeting) => {
          this.isCreatingMeeting = false;
          this.meetings.push(meeting);
          this.meetingForm.reset();
          this.participants.clear();
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

  getLocalDateString(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    return `${year}-${month}-${day}`;
  }

  viewMeeting(meetingId: string): void {
    this.router.navigate(['/meetings', meetingId]);
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
