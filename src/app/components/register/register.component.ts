import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  constructor(
    private authService: AuthService,
    private navigationService: NavigationService,
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

  onRegister(): void {
    // call the login service with the credentials
    this.authService
      .register(this.model.username, this.model.password)
      .subscribe(
        (result) => {
          if (!(result.statusText === 'Bad Request')) {
            this.localStorageService.storeValue('token', result);
            this.localStorageService.storeValue('user', this.model.username);
            this.navigationService.back2home();
          }
        },
        (err) => {
          this.error = true;
          this.errorMessage = 'Invalid username or password';
          console.log(this.errorMessage);
        }
      );
  }
}
