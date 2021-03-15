import { componentFactoryName } from '@angular/compiler';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';

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

class MockNavigationService {
  back(): void {}
  back2home(): void {}
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let service: AuthService;
  let navigation: NavigationService;

  let testUsername = 'test';
  let testPassword = 'test';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [LoginComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NavigationService, useClass: MockNavigationService },
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
    navigation = TestBed.inject(NavigationService);
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
    component.model.username = 'wrong';
    component.model.password = 'right';
    const spy = spyOn(navigation, 'back2home');

    component.onLogin();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call authenticate after onLogin()', () => {
    spyOn(service, 'authenticate').and.returnValue(of({}));
    component.model.username = testUsername;
    component.model.password = testPassword;
    component.onLogin();
    expect(service.authenticate).toHaveBeenCalled();
  });

  it('should navigate back to home after onLogin() with valid userModel', () => {
    const spy = spyOn(navigation, 'back2home');
    component.model.username = testUsername;
    component.model.password = testPassword;
    component.onLogin();
    expect(spy).toHaveBeenCalled();
  });
});
