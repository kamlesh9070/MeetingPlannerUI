import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { MeetingService } from '../../shared/services/meeting.service';
import { MeetingRequest, ParticipantDto } from '../../shared/models/index';
import { ValidationMapperService } from '../../shared/services/validation-mapper.service';

@Component({
  selector: 'app-create-meeting',
  templateUrl: './create-meeting.component.html',
  styleUrls: ['./create-meeting.component.scss']
})
export class CreateMeetingComponent {
  form: FormGroup;
  isSubmitting = false;
  errorMessage: string | null = null;

  constructor(
    private fb: FormBuilder,
    private meetingService: MeetingService,
    private router: Router,
    private validationMapper: ValidationMapperService
  ) {
    this.form = this.fb.group({
      title: ['', Validators.required],
      startDateTime: ['', Validators.required],
      durationMinutes: [60, [Validators.required, Validators.min(5)]],
      location: [''],
      description: [''],
      participants: this.fb.array([])
    });
  }

  get participants(): FormArray {
    return this.form.get('participants') as FormArray;
  }

  addParticipant(email = '') {
    const p: ParticipantDto = { name: '', email };
    this.participants.push(this.fb.control(p));
  }

  removeParticipant(index: number) {
    this.participants.removeAt(index);
  }

  private toLocalDateTimeString(date: Date): string {
    const pad = (value: number) => value.toString().padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }

  submit() {
    if (this.form.invalid) return;
    this.isSubmitting = true;
    this.errorMessage = null;

    const startTime = this.form.value.startDateTime;
    const start = new Date(startTime);
    const end = new Date(start.getTime() + (this.form.value.durationMinutes * 60000));

    const request: MeetingRequest = {
      title: this.form.value.title,
      description: this.form.value.description,
      startTime: startTime,
      endTime: this.toLocalDateTimeString(end),
      location: this.form.value.location,
      participants: this.participants.value as ParticipantDto[]
    };

    this.meetingService.createMeeting(request).subscribe({
      next: (m) => {
        this.isSubmitting = false;
        this.router.navigate(['/meetings']);
      },
      error: (err) => {
        this.isSubmitting = false;
        // map backend error codes to friendly messages
        const mapped = this.validationMapper.getMessage(err?.errorCode);
        if (mapped) {
          this.errorMessage = mapped;
        } else if (err?.details && typeof err.details === 'object') {
          // set form field errors where possible
          Object.entries(err.details).forEach(([field, msg]) => {
            // support field names like 'title' or 'participants[0].email'
            const control = this.form.get(field.replace(/\[(\d+)\]/g, '.$1'));
            if (control) {
              control.setErrors({ server: msg });
            }
          });
          this.errorMessage = err.message || 'Failed to create meeting';
        } else {
          this.errorMessage = this.formatApiError(err) || 'Failed to create meeting';
        }
      }
    });
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
