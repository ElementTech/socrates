import { Component } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { AuthenticationService, TokenPayload, UserDetails } from '../../service/authentication.service';

@Component({
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  details: UserDetails;
  password = "";
  error: string;

 

  constructor(private auth: AuthenticationService, private _snackBar: MatSnackBar) {}
  
  ngOnInit() {    
    this.auth.profile().subscribe(user => {
      this.details = user;
    }, (err) => {
      console.error(err);
    });
  }
  
  setPassword(){
    if (this.password != '')
    {
      console.log("setting password")
      this.auth.setpwd( {
        name: this.details.name,
        admin: this.details.admin,
        email: this.details.email,
        password: this.password
      }).subscribe(() => {
        this._snackBar.open('Password Succesfully Changed', 'Close', {
          duration: 3000
        });
      }, (err) => {
        this.error = err.error.message
        console.error(err);
      });
    }
    else
    {
      this._snackBar.open('Password Cannot Be Empty', 'Close', {
        duration: 3000
      });
    }
  }
}
