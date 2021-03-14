import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
// import { UserModel } from 'src/app/models/user-model';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
})
export class LoginComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private router: Router,
    private localStorageService: LocalStorageService
  ) {}

  public model = {
    username: '',
    password: '',
  };
  error = false;
  errorMessage = '';

  ngOnInit(): void {
    this.model.username = '';
    this.model.password = '';
  }

  onLogin(): void {
    // call the login service with the credentials
    this.authService
      .authenticate(this.model.username, this.model.password)
      .subscribe((result) => {
        if (!(result.statusText === 'Bad Request')) {
          this.localStorageService.storeValue('token', result);
          this.localStorageService.storeValue('user', this.model.username);
          this.router.navigate(['/home']);
        } else {
          this.error = true;
        }
      });
  }
}
