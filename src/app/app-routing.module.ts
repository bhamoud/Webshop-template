import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AboutComponent } from './shared/about/about.component';
import { SettingsComponent } from './settings/settings.component';
import { AdmintabComponent } from './admin/admintab/admintab.component';
import { ProductComponent } from './user/product/product.component';
import { LoginComponent } from './shared/login/login.component';
import { AuthGuardAdminService } from './services/auth-guard-admin.service';
import { AuthGuardService } from './services/auth-guard.service';

const routes: Routes = [
  {path: '', redirectTo: '/login', pathMatch:'full'},
  {path: 'about', component: AboutComponent},
  {path: 'admin', component: AdmintabComponent, canActivate: [AuthGuardAdminService]},
  {path: 'product', component: ProductComponent, canActivate: [AuthGuardService]},
  {path: 'settings', component: SettingsComponent, canActivate: [AuthGuardService]},
  {path: 'login', component: LoginComponent},


  {path: '**', redirectTo: '/login', pathMatch:'full'}
  
];

@NgModule({
  imports: [
    CommonModule, 
    RouterModule.forRoot(routes)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
