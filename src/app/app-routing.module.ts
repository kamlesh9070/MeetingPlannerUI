import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { ProfileComponent } from './profile/profile.component';
import { MeetingDetailComponent } from './meeting-detail/meeting-detail.component';
import { MeetingsListComponent } from './meetings/meetings-list/meetings-list.component';
import { CreateMeetingComponent } from './meetings/create-meeting/create-meeting.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  { path: 'dashboard', component: DashboardComponent },
  { path: 'profile', component: ProfileComponent },
  { path: 'meetings', component: MeetingsListComponent },
  { path: 'meetings/create', component: CreateMeetingComponent },
  { path: 'meetings/:id', component: MeetingDetailComponent },
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: '**', redirectTo: 'dashboard' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
