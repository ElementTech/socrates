import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../../services/authentication.service';
// import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  providers: [AuthenticationService]
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: '',
    admin: false
  };
  error: string;

  constructor(private auth: AuthenticationService, private router: Router
  ) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      this.error = err.error.message
      console.error(err);
    }); 
  }
}
