import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalStorageService } from 'src/app/services/local-storage.service';

import { NavbarComponent } from './navbar.component';

class MockLocalStorageService {
  key = '';
  data = '';

  getValue(key: string): any {
    if (this.key === key) {
      return this.data;
    } else {
      return null;
    }
  }
  storeValue(key: string, data: string): void {
    this.key = key;
    this.data = data;
  }
  removeValue(key: string): void {
    this.key = '';
    this.data = '';
  }
}

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  // let routerService: Router;
  let mockActivatedRoute;
  let localStorageService: LocalStorageService;

  beforeEach(async () => {
    mockActivatedRoute = { snapshot: { paramMap: { get: () => '/login' } } };
    await TestBed.configureTestingModule({
      imports: [RouterTestingModule],
      declarations: [NavbarComponent],
      providers: [
        { provide: ActivatedRoute, useValue: mockActivatedRoute },
        { provide: LocalStorageService, useClass: MockLocalStorageService },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    localStorageService = TestBed.inject(LocalStorageService);
    const activatedRouteService = TestBed.inject(ActivatedRoute);
    // routerService = TestBed.inject(Router);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a title', () => {
    expect(component.title).toBeTruthy();
  });

  it('should set loginRequired no token in local storage', () => {
    localStorageService.removeValue('token');

    component.ngOnInit();

    expect(component.loginRequired).toBe(true);
    expect(component.loginMessage).toBe('Login');
  });

  it('should clear loginRequired token in local storage', () => {
    localStorageService.storeValue('token', 'test token');

    component.ngOnInit();

    expect(component.loginRequired).toBe(false);
    expect(component.loginMessage).toBe('Logout');
  });

  // it('onLogout should clear username & token and set loginRequired', () => {
  //   localStorageService.storeValue('token', 'testtoken');
  //   localStorageService.storeValue('user', 'Test Player');
  //   component.loginRequired = false;

  //   component.onLogout();

  //   const out1 = expect(localStorageService.getValue('token')).toBe(null);
  //   const out2 = expect(localStorageService.getValue('user')).toBe(null);
  //   const out3 = expect(component.loginRequired).toBe(true);
  // });
});
