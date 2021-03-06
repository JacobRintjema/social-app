import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { fakeAsync } from '@angular/core/testing';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { AuthData } from './auth-data.model';
import { environment } from '../../environments/environment';
import { User } from './user/user.model';

const BACKEND_URL = environment.apiUrl + "/user";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private isAuthenticated: boolean = false;
  private userId: string;
  private user: User;


  constructor(private http: HttpClient, private router: Router) {

  }

  getToken() {
    return this.token;
  }

  getIsAuthenticated() {
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  getUserId() {
    return this.userId;
  }

  createUser(firstName: string, lastName: string, email: string, password: string) {
    const authData: AuthData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };

    return this.http
      .post(BACKEND_URL + "/signup", authData)
      .subscribe(() => {
        this.router.navigate(["/"]);
      }, error => {
        this.authStatusListener.next(false);
    });
  }

  login(email: string, password: string) {
    const authData: AuthData = {
      email: email,
      password: password
    };

    this.http.post<{
      token: string,
      expiresIn: number,
      userId: string
    }>(BACKEND_URL + '/login', authData).subscribe(res => {
      const token = res.token;
      this.token = token;

      if (token) {
        const expiresInDuration = res.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.userId = res.userId;
          this.isAuthenticated = true;
          this.authStatusListener.next(true);
          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);
          this.router.navigate(["/"]);
      }

    }, error => {
      this.authStatusListener.next(false);
    });
  }

  autoAuthUser() {
    const authInformation = this.getAuthData();

    if (!authInformation) {
      return;
    }

    const now = new Date();
    const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = authInformation.token;
      this.userId = authInformation.userId;
      this.isAuthenticated = true;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    this.userId = null;
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.router.navigate(["/"]);
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem("token", token);
    localStorage.setItem("expiration", expirationDate.toISOString());
    localStorage.setItem("userId", userId);
  }

  private clearAuthData() {
    localStorage.removeItem("token");
    localStorage.removeItem("expiration");
    localStorage.removeItem("userId");
  }

  private getAuthData() {
    const token = localStorage.getItem("token");
    const expirationDate = localStorage.getItem("expiration");
    const userId = localStorage.getItem("userId");

    if (!token || !expirationDate) {
      return;
    }

    return {
      token: token,
      expirationDate: new Date(expirationDate),
      userId: userId
    }
  }

  getUser(id: string) {
    return this.http.get<{
      firstName: string;
      lastName: string;
      email: string;
      password: string;
    }>(BACKEND_URL + "/profile/" + id);
  }

  updateUser(id: string, firstName: string, lastName: string, email: string, password: string) {
    const authData: AuthData = {
      firstName: firstName,
      lastName: lastName,
      email: email,
      password: password
    };

    this.http.put(BACKEND_URL + "/profile/" + id, authData).subscribe(data => {
      this.router.navigate(['/']);
    }, error => {
      this.authStatusListener.next(false);
    });
  }
}
