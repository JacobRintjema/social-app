import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy{
  authenticated: boolean = false;
  private authListenerSubs: Subscription;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.authenticated = this.auth.getIsAuthenticated();

    this.authListenerSubs = this.auth.getAuthStatusListener().subscribe(isAuthenticated => {
      this.authenticated = isAuthenticated;
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.auth.logout();
  }
}
