import { Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Injectable({ providedIn: 'root' })
export class NavigationService {
  history: string[] = [];

  constructor(private router: Router, private location: Location) {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.history.push(event.urlAfterRedirects);
      }
    });
  }

  back(): void {
    this.history.pop();
    if (this.history.length > 0) {
      this.location.back();
    } else {
      this.back2home();
    }
  }

  back2home(): void {
    this.router.navigateByUrl('/').then(() => {
      window.location.reload();
    });
  }
}
