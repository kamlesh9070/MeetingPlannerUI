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
  id?: string;
  name: string;
  email: string;
  status?: 'invited' | 'accepted' | 'declined';
}

export interface MeetingRequest {
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  participants?: ParticipantDto[];
}

export interface MeetingResponse {
  id: string;
  title: string;
  description?: string;
  startTime: string;
  endTime: string;
  location?: string;
  organizerId: string;
  organizerName: string;
  organizerEmail?: string;
  organizerAvatar?: string;
  participants: ParticipantDto[];
  createdAt?: string;
  updatedAt?: string;
}

export interface Meeting {
  id: string;
  title: string;
  description: string;
  startTime: string;
  endTime: string;
  location: string;
  organizer: UserDto;
  participants: ParticipantDto[];
  createdAt: string;
}
