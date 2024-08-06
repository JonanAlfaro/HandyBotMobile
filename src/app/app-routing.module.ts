import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '', redirectTo: 'home', pathMatch: 'full' 
  },
  {
    path: 'login',
    loadComponent: () =>  import('./login/login.page').then( m => m.LoginPage)
  },
  {
    path: 'home',
    loadComponent: () =>  import('./home/home.page').then( m => m.HomePage)
  },
  {
    path: 'registration',
    loadComponent: () =>  import('./registration/registration.page').then( m => m.RegistrationPage)
  },
  {
    path: 'admin',
    loadComponent: () =>  import('./admin/admin.page').then( m => m.AdminPage)
  },
  {
    path: 'user',
    loadComponent: () =>  import('./user/user.page').then( m => m.UserPage)
  },
  {
    path: 'hand-tracking',
    loadComponent: () =>  import('./hand-tracking/hand-tracking.component').then( m => m.HandTrackingComponent)
  }
];


// @NgModule({
//   imports: [
//     RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
//   ],
//   exports: [RouterModule]
// })
// export class AppRoutingModule {}
