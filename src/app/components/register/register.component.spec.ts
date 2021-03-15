import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';
import { NavigationService } from 'src/app/services/navigation.service';

import { RegisterComponent } from './register.component';

class MockAuthService {
  register(username: string, password: string): Observable<any> {
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

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let service: AuthService;
  let navigation: NavigationService;

  let testUsername = 'test';
  let testPassword = 'test';

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [RegisterComponent],
      providers: [
        { provide: AuthService, useClass: MockAuthService },
        { provide: NavigationService, useClass: MockNavigationService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RegisterComponent);
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

  it('should not have error after successful onRegister()', () => {
    component.model.username = testUsername;
    component.model.password = testPassword;
    component.onRegister();
    expect(component.error).toBeFalsy();
  });

  it('should have error after unsuccessful onRegister()', () => {
    component.model.username = 'wrong';
    component.model.password = 'right';
    const spy = spyOn(navigation, 'back2home');

    component.onRegister();
    expect(spy).not.toHaveBeenCalled();
  });

  it('should call register after onRegister()', () => {
    spyOn(service, 'register').and.returnValue(of({}));
    component.model.username = testUsername;
    component.model.password = testPassword;
    component.onRegister();
    expect(service.register).toHaveBeenCalled();
  });

  it('should navigate back to home after onRegister() with valid userModel', () => {
    const spy = spyOn(navigation, 'back2home');
    component.model.username = testUsername;
    component.model.password = testPassword;
    component.onRegister();
    expect(spy).toHaveBeenCalled();
  });
});
