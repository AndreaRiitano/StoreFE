import { APP_INITIALIZER, NgModule } from '@angular/core';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi, HttpClientModule } from '@angular/common/http';
import { BrowserModule, provideClientHydration } from '@angular/platform-browser';
import {KeycloakService} from './security/keycloak/keycloak.service';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './components/home/home.component';
import { AuthInterceptor } from './security/keycloak/auth.interceptor';
import { RouterModule } from '@angular/router';
import { CartComponent } from './components/cart/cart.component';
import { PersonalAreaComponent } from './components/personalarea/personalarea.component';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from './components/navbar/navbar.component';
import { InvoiceComponent } from './components/invoice/invoice.component';
import { OrdersComponent } from './components/orders/orders.component';
import { DetailComponent } from './components/detail/detail.component';


@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    CartComponent,
    PersonalAreaComponent,
    NavbarComponent,
    InvoiceComponent,
    OrdersComponent,
    DetailComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [
    KeycloakService,
    {
      provide: APP_INITIALIZER,
      useFactory: (kc: KeycloakService) => () => kc.init(),
      multi: true,
      deps: [KeycloakService]
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
