import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router'; // we also need angular router for Nebular to function properly
import {  
  NbLayoutModule, 
  NbButtonModule, 
  NbAlertModule, 
  NbCardModule,
  NbActionsModule,
  
  NbDatepickerModule, NbIconModule,
  NbInputModule,
 
  NbSpinnerModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';

import { LoginPage } from './login.page';

const routes: Routes = [
  {
    path: '',
    component: LoginPage,
  }
];

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    NbActionsModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbSpinnerModule,
    FormsModule,
    RouterModule.forChild(routes),
    RouterModule, // RouterModule.forRoot(routes, { useHash: true }), if this is your app.module
    NbLayoutModule,
    NbButtonModule,
    NbAlertModule,
    NbCardModule,
  ],
  declarations: [LoginPage]
})
export class LoginPageModule {}
