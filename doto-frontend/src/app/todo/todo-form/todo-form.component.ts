import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-todo-form',
  standalone: true,
  imports: [FormsModule, HttpClientModule],
  templateUrl: './todo-form.component.html',
  styleUrls: ['./todo-form.component.css'],
})
export class TodoFormComponent {
  task = {
    title: '',
    description: '',
    dueDate: '',
    status: 'Pending'
  };

  constructor(
    private dialogRef: MatDialogRef<TodoFormComponent>,
    private http: HttpClient,
    @Inject(MAT_DIALOG_DATA) public data: any  // Inject the task data if any
  ) {
    if (data) {
      this.task = { ...data };
    }
  }

  onSubmitTask() {
    if (this.data) {
      // Edit existing task
      this.http.patch(`http://localhost:8000/tasks/edit-task/`, this.task).subscribe({
        next: (response) => {
          
          console.log('Task updated', response);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Failed to update task', error);
        }
      });
    } else {
      // Create new task
      this.http.post('http://localhost:8000/tasks/create-task', this.task).subscribe({
        next: (response) => {
          console.log('Task created', response);
          this.dialogRef.close(true);
        },
        error: (error) => {
          console.error('Failed to create task', error);
        }
      });
    }
  }

  onCancel() {
    this.dialogRef.close();
  }
}
