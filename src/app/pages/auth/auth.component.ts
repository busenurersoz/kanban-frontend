import { FeedbackService } from './../../core/services/feedback.service';
import { AuthService } from './auth.service';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FeedbackTypes } from '@core/enums/feedback-types.enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  form: FormGroup;
  isLoading = false;
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private feedbackService: FeedbackService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      username: [null, [Validators.required, Validators.minLength(5)]],
      password: [null, [Validators.required, Validators.minLength(5)]],
    });
  }

  submitForm() {
    if (this.form.invalid) return;
    this.isLoading = true;
    const formData = this.form.getRawValue();
    if (formData.username === 'busenur' && formData.password === '12345') {
      setTimeout(() => {
        this.isLoading = false;
        this.authService.login();
        this.feedbackService.createNotification(
          FeedbackTypes.success,
          'You logged in successfully'
        );
        this.router.navigateByUrl('/workspaces/all');
      }, 2000);
    } else {
      setTimeout(() => {
        this.isLoading = false;
        this.feedbackService.createNotification(
          FeedbackTypes.error,
          'Username or Password was not currect'
        );
      }, 1000);
    }
  }
}
