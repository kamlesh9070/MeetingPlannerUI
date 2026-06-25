import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './shared/services/auth.service';
import { UserDto } from './shared/models/index';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'Meeting Planner';
  currentUser$: Observable<UserDto | null>;

  constructor(private authService: AuthService) {
    this.currentUser$ = this.authService.currentUser$;
  }
}
