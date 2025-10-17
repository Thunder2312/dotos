import { Component } from '@angular/core';
import { PasswordToggleDirective } from '../directives/password-toggle.directive';
import { signupData } from './signupdata.model';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from "@angular/forms";
import { Router } from '@angular/router';
@Component({
  selector: 'app-signup-card',
  imports: [PasswordToggleDirective, FormsModule, HttpClientModule],
  templateUrl: './signup-card.component.html',
  styleUrl: './signup-card.component.css',
  standalone: true
})
export class SignupCardComponent {
  userData: signupData = {
    username: '',
    password: '',
    email: '', 
  };

  goToLogin(){
    this.router.navigate(['login'])
  }
   constructor(private http: HttpClient, private router: Router) {}
  
  onSubmit(){
    this.http.post('http://localhost:8000/user/register', this.userData).subscribe({
      next: res=>{
        console.log('signup completed', res);
        this.goToLogin();
      },
      error: err=>{
        console.log('Registration failed', err)
      }
    })
  }
}
