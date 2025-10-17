import { Component } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { HttpClientModule } from '@angular/common/http';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import {CdkDrag} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-todo',
  standalone: true,
  imports: [MatDialogModule, HttpClientModule, CommonModule],
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
})
export class TodoComponent {
  username! : string;

  constructor(private dialog: MatDialog, private http: HttpClient, private router: Router) {}
  isAuthenticated = false;
  activeTask = false;

  ngOnInit() {
  const token = sessionStorage.getItem('jwtToken');
  this.username = sessionStorage.getItem('username') || '';
  

  if (!token) {
    this.router.navigate(['login']);
    return;
  }

  this.http.get('http://localhost:8000/user/todo').subscribe({
    next: () => {
      this.isAuthenticated = true;
    },
    error: () => {
      this.isAuthenticated = false;
      this.router.navigate(['login']);
    }
  });

  this.fetchTasks();
}
tasks: any[] = [];


fetchTasks = () => {
  this.http.get('http://localhost:8000/tasks/my-tasks').subscribe({
    next: (res:any) => {
      this.tasks = res;
    },
    error: (err) => {
      console.error('Error fetching tasks:', err);
    }

  })
}

editTask(task: any) {
  const dialogRef = this.dialog.open(TodoFormComponent, {
  width: '400px',
  data: { ...task },  // Pass task to be edited
});
dialogRef.afterClosed().subscribe(result => {
  if (result) {
    this.fetchTasks(); // Refresh task list
  }
});
}


deleteTask(taskId: string) {
  console.log('Deleting task ID:', taskId);
  this.http.delete(`http://localhost:8000/tasks/delete-task/${taskId}`).subscribe({
     next: (res:any) => {
      console.log('Task deleted successfully')
      this.fetchTasks();
    },
    error: (err) => {
      console.error('Error deleting tasks from frontend:', err);
    }
  })
}

onLogout() {
  sessionStorage.removeItem('jwtToken'); //remove token
  this.isAuthenticated = false;
  this.router.navigate(['login']);
}


  openTaskDialog() {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log('Task Added:', result);
        this.fetchTasks();
      }
    });
  }
}
