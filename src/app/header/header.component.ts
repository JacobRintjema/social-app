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
  id: string;

  constructor(private auth: AuthService) {}

  ngOnInit() {
    this.authenticated = this.auth.getIsAuthenticated();
    this.id = this.auth.getUserId();

    this.authListenerSubs = this.auth.getAuthStatusListener().subscribe(isAuthenticated => {
      this.authenticated = isAuthenticated;
      this.id = this.auth.getUserId();
    });
  }

  ngOnDestroy() {
    this.authListenerSubs.unsubscribe();
  }

  onLogout() {
    this.auth.logout();
  }
}
