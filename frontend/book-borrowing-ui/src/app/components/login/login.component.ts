import { Component } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.css'
})
export class LoginComponent {

  loginForm: FormGroup;

  constructor(

    private fb: FormBuilder,
    
    private authService: AuthService
    
    ) {

    this.loginForm = this.fb.group({

      email: [
      
      '',
      
      [
      
      Validators.required,
      
      Validators.email
      
      ]
      
      ],
      
      password: [
      
      '',
      
      [
      
      Validators.required,
      
      Validators.minLength(6)
      
      ]
      
      ]
      
      });

  }

  onSubmit() {

    this.authService
  
        .login(this.loginForm.value)
  
        .subscribe({
  
          next: (response) => {
  
            console.log(response);
  
          },
  
          error: (error) => {
  
            console.log(error);
  
          }
  
        });
  
  }

}