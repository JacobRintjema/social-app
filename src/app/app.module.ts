import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HeaderComponent } from './header/header.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorInterceptor } from './error-interceptor';
import { ErrorComponent } from './error/error.component';
import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';
import { RouterModule } from '@angular/router';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AngularMaterialModule,
    PostsModule,
    RouterModule,
  ],
  providers: [
    {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true},
    {provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true},
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
