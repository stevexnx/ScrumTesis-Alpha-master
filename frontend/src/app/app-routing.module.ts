import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { RegisterComponent } from './components/pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';

const routes: Routes = [
  // {
  //   path: '', pathMatch: 'full', redirectTo: '/login'
  // },
  {
    path: '', component: LoginComponent
  },
  {
    path: 'register', component: RegisterComponent
  },
  {
    path: 'board',
    loadChildren: () => import('./pages/board-page/board-page.module').then(m => m.BoardPageModule)
  },
  {
    path: 'projects',
    loadChildren: () => import('./pages/project-pages/project-pages.module').then(m => m.ProjectPagesModule)
  },
  {
    path: '**',
    loadChildren: () => import('./pages/error404-page/error404-page.module').then(m => m.Error404PageModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
