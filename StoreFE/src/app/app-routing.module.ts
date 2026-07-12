import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component'
import { PersonalAreaComponent } from './components/personalarea/personalarea.component'
const routes: Routes = [
  { path: '', component: HomeComponent },
  { path:'personalarea', component: PersonalAreaComponent},
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
