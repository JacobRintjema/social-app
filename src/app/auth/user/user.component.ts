import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth.service';
import { User } from './user.model';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit, OnDestroy{
  isLoading: boolean = false;
  id: string;
  user: User;
  form: FormGroup;
  private authStatusSub: Subscription;

  constructor(
    public auth: AuthService,
    public route: ActivatedRoute,
  ) {

  }

  ngOnInit() {
    this.authStatusSub = this.auth.getAuthStatusListener().subscribe(status => {
      this.isLoading = false;
    });

    this.form = new FormGroup({
      firstName: new FormControl(null, {
        validators: [Validators.required]
      }),
      lastName: new FormControl(null, {
        validators: [Validators.required]
      }),
      email: new FormControl(null, {
        validators: [Validators.required]
      }),
      password: new FormControl(null, {
        validators: [Validators.required]
      }),
    });

    this.route.paramMap.subscribe((paramMap: ParamMap) => {

      this.id = paramMap.get("userId");
      this.isLoading = true;
      this.auth.getUser(this.id).subscribe(userData => {
        this.isLoading = false;
        this.user = {
          firstName: userData.firstName,
          lastName: userData.lastName,
          email: userData.email,
          password: userData.password
        };
        this.form.setValue({
          firstName: this.user.firstName,
          lastName: this.user.lastName,
          email: this.user.email,
          password: ""
        });
      });
    });
  }

  ngOnDestroy() {
    this.authStatusSub.unsubscribe();
  }

  onSaveUser() {
    if (this.form.invalid) {
      return;
    }
    this.isLoading = true;
    this.auth.updateUser(
      this.auth.getUserId(),
      this.form.value.firstName,
      this.form.value.lastName,
      this.form.value.email,
      this.form.value.password
    );
  }

}
