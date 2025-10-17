import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SignupCardComponent } from './signup-card/signup-card.component';
import { LoginCardComponent } from './login-card/login-card.component';
import { TodoComponent } from './todo/todo.component';
import { AuthGuard } from './auth.guard';
export const routes: Routes = [
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  { path: 'login', component: LoginCardComponent },
  { path: 'signup', component: SignupCardComponent },
  {
    path: 'todo',
    component: TodoComponent,
    canActivate: [AuthGuard], 
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {}
