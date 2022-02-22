import { Component } from '@angular/core';
import { AuthenticationService, TokenPayload } from '../../service/authentication.service';
import {GoogleLoginProvider, SocialAuthService} from 'angularx-social-login';
import { Router } from '@angular/router';

@Component({
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  credentials: TokenPayload = {
    email: '',
    password: '',
    admin: false
  };
  error: string;

  constructor(private auth: AuthenticationService, private router: Router
    //,private socialAuthService: SocialAuthService
    ) {}
  // loginWithGoogle(): void {
  //   this.socialAuthService.signIn(GoogleLoginProvider.PROVIDER_ID)
  //     .then(() => {
  //       //this.credentials.email = 
  //       this.socialAuthService.authState.subscribe(data=>{
  //         console.log(data)
  //       })
  //       //this.login()
  //     });
  // }
  login() {
    this.auth.login(this.credentials).subscribe(() => {
      this.router.navigateByUrl('/profile');
    }, (err) => {
      this.error = err.error.message
      console.error(err);
    }); 
  }
}
