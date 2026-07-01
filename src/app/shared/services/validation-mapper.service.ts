import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class ValidationMapperService {
  private mapping: Record<string, string> = {
    EMPTY_TITLE: 'Please enter a meeting title.',
    MISSING_TIME: 'Please provide both start and end times.',
    INVALID_TIME_RANGE: 'End time must be after start time.',
    PAST_START_TIME: 'Start time cannot be in the past.',
    EMPTY_PARTICIPANT_NAME: 'Participant name is required.',
    EMPTY_PARTICIPANT_EMAIL: 'Participant email is required.',
    INVALID_DATETIME_FORMAT: 'Invalid date/time format. Use yyyy-MM-ddTHH:mm:ss.',
    MISSING_AUTH_TOKEN: 'Authentication token is missing. Please login again.',
    INVALID_AUTH_TOKEN: 'Authentication failed. Please login again.',
    MEETING_NOT_FOUND: 'Requested meeting was not found.',
    FORBIDDEN: 'You are not allowed to access this resource.'
  };

  getMessage(errorCode?: string): string | undefined {
    if (!errorCode) return undefined;
    return this.mapping[errorCode];
  }
}
