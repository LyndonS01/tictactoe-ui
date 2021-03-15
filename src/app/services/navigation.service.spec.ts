import { TestBed } from '@angular/core/testing';
import { NavigationEnd, Router } from '@angular/router';
import { Location } from '@angular/common';
import { Observable, of } from 'rxjs';

import { NavigationService } from './navigation.service';

class MockRouter {
  events: Observable<NavigationEnd> = of(new NavigationEnd(1, '', ''));
  navigateByUrl(): void {}
}

class MockLocation {
  back(): void {}
  back2home(): void {}
}

describe('NavigationService', () => {
  let service: NavigationService;
  let router: Router;
  let location: Location;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [
        { provide: Router, useClass: MockRouter },
        { provide: Location, useClass: MockLocation },
      ],
    });
    service = TestBed.inject(NavigationService);
    router = TestBed.inject(Router);
    location = TestBed.inject(Location);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call location back if there is browser history', () => {
    spyOn(location, 'back');
    service.history.push('');
    service.back();
    expect(location.back).toHaveBeenCalled();
  });

  it('should navigateByUrl if no browser history', () => {
    spyOn(router, 'navigateByUrl').and.returnValue(new Promise(() => {}));
    service.back();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });

  it('should return to home when called', () => {
    spyOn(router, 'navigateByUrl').and.returnValue(new Promise(() => {}));
    service.back2home();
    expect(router.navigateByUrl).toHaveBeenCalled();
  });
});
