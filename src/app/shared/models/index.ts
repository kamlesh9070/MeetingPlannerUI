export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  username: string;
  displayName: string;
  email: string;
  password: string;
}

export interface UserDto {
  id: string;
  username: string;
  displayName: string;
  email: string;
  avatarUrl?: string;
  authToken: string;
}

export interface ParticipantDto {
  name: string;
  email: string;
}

export interface MeetingRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  participants?: ParticipantDto[];
}

export interface MeetingResponse {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  organizerId: string;
  organizerName: string;
  participants: ParticipantDto[];
}
