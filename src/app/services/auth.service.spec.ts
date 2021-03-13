import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { getTestBed, TestBed } from '@angular/core/testing';
import { environment } from 'src/environments/environment';

import { AuthService } from './auth.service';

describe('AuthService', () => {
  let injector: TestBed;
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService],
    });
    injector = getTestBed();
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // it should authenticate a valid user
  describe('#authenticate', () => {
    it('it should return a token when provided a valid user', () => {
      const testUser = {
        username: 'test',
        password: 'test',
      };

      const testToken = {
        value: 'some-test-token-value',
      };

      service
        .authenticate(testUser.username, testUser.password)
        .subscribe((token) => {
          expect(JSON.stringify(testToken)).toEqual(token);
        });

      const req = httpMock.expectOne(
        environment.auth.url + environment.auth.endpoint
      );
      expect(req.request.method).toBe('POST');
      req.flush(testToken);
    });
  });

  // it should not authenticate an invalid user
  describe('#invalid-authenticate', () => {
    it('should not validate an invalid user', () => {
      const invalidTestUser = {
        username: 'invalid-test',
        password: 'invalid-test',
      };

      const error = {
        status: 404,
        statusText: 'Bad Request',
      };

      service
        .authenticate(invalidTestUser.username, invalidTestUser.password)
        .subscribe((response) => {
          expect(response).toEqual(JSON.stringify(error));
        });

      const req = httpMock.expectOne(
        environment.auth.url + environment.auth.endpoint
      );
      expect(req.request.method).toBe('POST');
      req.flush(error);
    });
  });

  // it should register an valid user
  describe('#register', () => {
    it('it should return a token when provided a user value that isnt taken', () => {
      const newTestUser = {
        username: 'newtest',
        password: 'newtest',
      };

      const testToken = {
        value: 'some-test-token-value',
      };

      service
        .register(newTestUser.username, newTestUser.password)
        .subscribe((token) => {
          expect(JSON.stringify(testToken)).toEqual(token);
        });

      const req = httpMock.expectOne(
        environment.auth.url +
          environment.auth.endpoint +
          environment.auth.register
      );
      expect(req.request.method).toBe('POST');
      req.flush(testToken);
    });
  });

  // it should not register an invalid user
  describe('#invalid-register', () => {
    it('should not validate an invalid user if it already exists', () => {
      const newInvalidTestUser = {
        username: 'invalid-test',
        password: 'invalid-test',
      };

      const error = {
        status: 404,
        statusText: 'Bad Request',
      };

      service
        .register(newInvalidTestUser.username, newInvalidTestUser.password)
        .subscribe((response) => {
          expect(response).toEqual(JSON.stringify(error));
        });

      const req = httpMock.expectOne(
        environment.auth.url +
          environment.auth.endpoint +
          environment.auth.register
      );
      expect(req.request.method).toBe('POST');
      req.flush(error);
    });
  });
});
