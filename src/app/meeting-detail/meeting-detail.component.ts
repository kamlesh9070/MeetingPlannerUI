import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { MeetingService } from '../shared/services/meeting.service';
import { MeetingResponse } from '../shared/models/index';

@Component({
  selector: 'app-meeting-detail',
  templateUrl: './meeting-detail.component.html',
  styleUrls: ['./meeting-detail.component.scss']
})
export class MeetingDetailComponent implements OnInit {
  meeting: MeetingResponse | null = null;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private authService: AuthService,
    private meetingService: MeetingService
  ) {}

  ngOnInit(): void {
    if (!this.authService.currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    this.route.paramMap.subscribe(params => {
      const meetingId = params.get('id');
      if (!meetingId) {
        this.router.navigate(['/dashboard']);
        return;
      }
      this.loadMeeting(meetingId);
    });
  }

  loadMeeting(meetingId: string): void {
    this.isLoading = true;
    this.errorMessage = null;
    this.meeting = null;

    this.meetingService.getMeeting(meetingId).subscribe({
      next: (meeting) => {
        this.meeting = meeting;
        this.isLoading = false;
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = error.message || 'Failed to load meeting details';
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/dashboard']);
  }
}
