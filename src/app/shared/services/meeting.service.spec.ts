import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MeetingService } from './meeting.service';
import { AuthService } from './auth.service';
import { environment } from '../../../environments/environment';

describe('MeetingService', () => {
  let service: MeetingService;
  let httpMock: HttpTestingController;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('AuthService', ['getAuthToken']);

    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MeetingService, { provide: AuthService, useValue: spy }]
    });

    service = TestBed.inject(MeetingService);
    httpMock = TestBed.inject(HttpTestingController);
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    authServiceSpy.getAuthToken.and.returnValue('test-token');
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should fetch meetings list', () => {
    const mock = [{ id: '1', title: 'Test', startTime: new Date().toISOString(), endTime: new Date().toISOString(), organizerId: 'u1', organizerName: 'User', participants: [] }];

    service.listMeetings().subscribe((res) => {
      expect(res).toEqual(mock as any);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/meetings`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('X-Auth-Token')).toBe('test-token');
    req.flush(mock);
  });

  it('should fetch meeting detail', () => {
    const id = 'abc';
    const mock = { id, title: 'Detail', startTime: new Date().toISOString(), endTime: new Date().toISOString(), organizerId: 'u1', organizerName: 'User', participants: [] };

    service.getMeeting(id).subscribe((res) => {
      expect(res).toEqual(mock as any);
    });

    const req = httpMock.expectOne(`${environment.apiBaseUrl}/meetings/${id}`);
    expect(req.request.method).toBe('GET');
    expect(req.request.headers.get('X-Auth-Token')).toBe('test-token');
    req.flush(mock);
  });
});
