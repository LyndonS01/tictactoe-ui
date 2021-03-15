import { Component, OnChanges, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { NavigationService } from 'src/app/services/navigation.service';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})
export class NavbarComponent implements OnInit {
  constructor(
    public router: Router,
    private localStorageService: LocalStorageService,
    private navigationService: NavigationService
  ) {}

  loginRequired = true;
  loginMessage = '';
  title = 'Welcome to Tic-Tac-Toe';

  ngOnInit(): void {
    if (this.localStorageService.getValue('token') != null) {
      this.loginMessage = 'Logout';
      this.loginRequired = false;
    } else {
      this.loginMessage = 'Login';
      this.loginRequired = true;
    }
  }

  onLogout(): void {
    this.localStorageService.removeValue('token');
    this.localStorageService.removeValue('user');
    this.loginRequired = true;
    this.navigationService.back2home();
  }
}
