import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'
import { PersonalAreaComponent } from './components/personalarea/personalarea.component'
import { CartComponent } from './components/cart/cart.component'
import { AuthGuard } from './security/auth/auth.guard'
import { InvoiceComponent } from './components/invoice/invoice.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  { path:'personalarea', component: PersonalAreaComponent, canActivate: [AuthGuard]},
  { path: 'cart', component: CartComponent, canActivate: [AuthGuard]},
  { path: 'invoice', component: InvoiceComponent, canActivate: [AuthGuard]},
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
