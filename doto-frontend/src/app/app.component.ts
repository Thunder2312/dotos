import { Component, Renderer2 } from '@angular/core';

import { Router, RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  imports: [ RouterOutlet, HttpClientModule]   
})
export class AppComponent {
  title = 'doto';
   mode = false;
  signUp = false;
   constructor(private renderer: Renderer2, private router:Router) {}


   
}
