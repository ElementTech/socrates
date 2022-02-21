import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../service/authentication.service';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: ''
  };
  error: string;

  constructor(private auth: AuthenticationService, private router: Router) {}

  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      this.error = err.error.message
      console.error(err);
    }); 
  }
}
