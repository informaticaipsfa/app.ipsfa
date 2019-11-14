import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Routes, RouterModule } from '@angular/router'; // we also need angular router for Nebular to function properly
import { 
  NbSidebarModule, 
  NbLayoutModule, 
  NbButtonModule, 
  NbAlertModule, 
  NbCardModule,
  NbActionsModule,
  NbCheckboxModule,
  NbDatepickerModule, NbIconModule,
  NbInputModule,
  NbRadioModule,
  NbSpinnerModule,
  NbSelectModule,
  NbUserModule,
  NbTabsetModule,
  NbListModule,
} from '@nebular/theme';

import { ThemeModule } from '../@theme/theme.module';

import { RegistrarsePage } from './registrarse.page';

const routes: Routes = [
  {
    path: '',
    component: RegistrarsePage,
  }
];

@NgModule({
  imports: [
    ThemeModule,
    CommonModule,
    NbActionsModule,
    NbCheckboxModule,
    NbDatepickerModule, NbIconModule,
    NbInputModule,
    NbRadioModule,
    NbSelectModule,
    NbSpinnerModule,
    NbTabsetModule,
    NbListModule,
    NbUserModule,
    FormsModule,
    RouterModule.forChild(routes),
    RouterModule, // RouterModule.forRoot(routes, { useHash: true }), if this is your app.module
    NbLayoutModule,
    NbSidebarModule, // NbSidebarModule.forRoot(), //if this is your app.module
    NbButtonModule,
    NbAlertModule,
    NbCardModule,
  ],
  declarations: [RegistrarsePage]
})
export class RegistrarsePageModule {}
