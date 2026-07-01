import { Component, OnInit } from '@angular/core';
import { MeetingService } from '../../shared/services/meeting.service';
import { MeetingResponse } from '../../shared/models/index';
import { Router } from '@angular/router';

@Component({
  selector: 'app-meetings-list',
  templateUrl: './meetings-list.component.html',
  styleUrls: ['./meetings-list.component.scss']
})
export class MeetingsListComponent implements OnInit {
  meetings: MeetingResponse[] = [];
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private meetingService: MeetingService, private router: Router) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings() {
    this.isLoading = true;
    this.meetingService.listMeetings().subscribe({
      next: (m) => {
        this.meetings = m;
        this.isLoading = false;
      },
      error: (err) => {
        this.errorMessage = this.formatApiError(err) || 'Failed to load meetings';
        this.isLoading = false;
      }
    });
  }

  view(meeting: MeetingResponse) {
    this.router.navigate(['/meetings', meeting.id]);
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
