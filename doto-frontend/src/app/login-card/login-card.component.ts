import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Renderer2 } from '@angular/core';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PasswordToggleDirective } from '../directives/password-toggle.directive';


@Component({
  selector: 'app-login-card',
  imports: [
    CommonModule,
    FormsModule,
    HttpClientModule,
    PasswordToggleDirective,
  ],
  templateUrl: './login-card.component.html',
  styleUrl: './login-card.component.css',
  standalone: true,
})
export class LoginCardComponent {
  show: boolean = false;
  trueLogin: boolean = false;
  enteredUsername = '';
  enteredPassword = '';
  loginError: string | null = null;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private http: HttpClient
  ) {}

  gotoSignup() {
    this.router.navigate(['signup']);
  }

  onSubmit() {
  const loginData = {
    username: this.enteredUsername,
    password: this.enteredPassword,
  };

  this.loginError = null;
  this.http.post<any>('http://localhost:8000/user/login', loginData).subscribe({
    next: (res) => {
      const token = res.token;
      if (token) {
        sessionStorage.setItem('jwtToken', token); // Store JWT
        sessionStorage.setItem('username', loginData.username)
        this.trueLogin = true;
        this.router.navigate(['todo']);
      } else {
        this.loginError = 'Login failed: No token received.';
      }
    },
    error: (err) => {
      if (err.status === 401) {
        this.loginError = 'Invalid username or password.';
      } else {
        this.loginError = 'Server error. Please try again later.';
      }
      console.error('Error saving login data:', err);
    },
  });
}

}
