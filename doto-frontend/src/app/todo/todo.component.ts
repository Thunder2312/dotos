import { Component, inject, signal } from '@angular/core';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TodoFormComponent } from './todo-form/todo-form.component';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CdkDragDrop, DragDropModule } from '@angular/cdk/drag-drop';
import { CommonModule } from '@angular/common';

interface Task {
  _id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'Pending' | 'Completed';
}

@Component({
  selector: 'app-todo',
  standalone: true,
  templateUrl: './todo.component.html',
  styleUrls: ['./todo.component.css'],
  imports: [
    CommonModule,
    DragDropModule,
    MatDialogModule
  ]
})
export class TodoComponent {
  private dialog = inject(MatDialog);
  private http = inject(HttpClient);
  private router = inject(Router);

  username = signal<string>('');
  isAuthenticated = signal<boolean>(false);
  pendingTasks = signal<Task[]>([]);
  completedTasks = signal<Task[]>([]);

  ngOnInit() {
    const token = sessionStorage.getItem('jwtToken');
    const storedUsername = sessionStorage.getItem('username') || '';
    this.username.set(storedUsername);

    if (!token) {
      this.router.navigate(['login']);
      return;
    }

    this.http.get('http://localhost:8000/user/todo').subscribe({
      next: () => {
        this.isAuthenticated.set(true);
      },
      error: () => {
        this.isAuthenticated.set(false);
        this.router.navigate(['login']);
      }
    });

    this.fetchTasks();
  }

  fetchTasks = () => {
    this.http.get<Task[]>('http://localhost:8000/tasks/my-tasks').subscribe({
      next: (res) => {
        this.pendingTasks.set(res.filter(task => task.status === 'Pending'));
        this.completedTasks.set(res.filter(task => task.status === 'Completed'));
      },
      error: (err) => {
        console.error('Error fetching tasks:', err);
      }
    });
  };

  editTask(task: Task) {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '400px',
      data: { ...task },
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.fetchTasks();
      }
    });
  }

  deleteTask(taskId: string) {
    this.http.delete(`http://localhost:8000/tasks/delete-task/${taskId}`).subscribe({
      next: () => {
        this.fetchTasks();
      },
      error: (err) => {
        console.error('Error deleting tasks:', err);
      }
    });
  }

  openTaskDialog() {
    const dialogRef = this.dialog.open(TodoFormComponent, {
      width: '400px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.fetchTasks();
      }
    });
  }

  onLogout() {
    sessionStorage.removeItem('jwtToken');
    this.isAuthenticated.set(false);
    this.router.navigate(['login']);
  }

  onTaskDrop(event: CdkDragDrop<Task[]>, newStatus: 'Pending' | 'Completed') {
    const task = event.item.data;

    if (!task || task.status === newStatus) return;

    const updatedTask = { ...task, status: newStatus };

    this.http.patch(`http://localhost:8000/tasks/edit-task`, updatedTask).subscribe({
      next: () => {
        this.fetchTasks();
      },
      error: (err) => {
        console.error('Error updating task status:', err);
      }
    });
  }
}