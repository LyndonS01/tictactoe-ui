import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
// import { UserModel } from 'src/app/models/user-model';
import { AuthService } from 'src/app/services/auth.service';

import { LoginComponent } from './login.component';

class MockAuthService {
  authenticate(username: string, password: string): Observable<any> {
    if (username === 'test' && password === 'test') {
      return of({});
    } else {
      return of({ statusText: 'Bad Request' });
    }
  }
}

class MockRouter {
  navigate(): void {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: AuthService;
  let router: Router;

  let testUsername = '';
  let testPassword = '';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: Router, useClass: MockRouter },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;

    testUsername = 'test';
    testPassword = 'test';

    fixture.detectChanges();
    service = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have no username after init', () => {
    expect(component.model.username).toEqual('');
  });

  it('should have no password after init', () => {
    expect(component.model.password).toEqual('');
  });

  it('should not have a submission error after init', () => {
    expect(component.error).toBeFalsy();
  });

  it('should not have error after successful onLogin()', () => {
    component.model.username = testUsername;
    component.model.password = testPassword;
    component.onLogin();
    expect(component.error).toBeFalsy();
  });

  it('should have error after unsuccessful onLogin()', () => {
    component.onLogin();
    expect(component.error).toBeTruthy();
  });

  // it('should set username', () => {
  //   component.model.username = testUsername;
  //   expect(component.model.username).toEqual(testUsername);
  // });

  // it('should set password', () => {
  //   component.model.password = testPassword;
  //   expect(component.model.password).toEqual(testPassword);
  // });

  it('should call authenticate after onLogin()', () => {
    spyOn(service, 'authenticate').and.returnValue(of({}));
    component.model.username = testUsername;
    component.model.password = testPassword;
    component.onLogin();
    expect(service.authenticate).toHaveBeenCalled();
  });

  it('should navigate back to home after onLogin() with valid userModel', () => {
    const spy = spyOn(router, 'navigate');
    component.model.username = testUsername;
    component.model.password = testPassword;
    component.onLogin();
    expect(spy).toHaveBeenCalled();
  });
});
