import { NgModule } from '@angular/core';
import {
  NbMenuModule,
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbSpinnerModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
  NbCheckboxModule,
  NbAlertModule,
} from '@nebular/theme';
import { FormsModule } from '@angular/forms'
import { ThemeModule } from '../@theme/theme.module'
import { PagesComponent } from './pages.component'
// import { MensajeComponent } from './mensaje/mensaje.component'
// import { CambiarComponent } from './cambiar/cambiar.component'
import { DashboardModule } from './dashboard/dashboard.module'
import { PagesRoutingModule } from './pages-routing.module'

@NgModule({
  imports: [
    PagesRoutingModule,
    ThemeModule,
    NbMenuModule,
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbSpinnerModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbSelectModule,
    NbCheckboxModule,
    NbAlertModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,    
    DashboardModule,
  ],
  declarations: [
    PagesComponent,
    // MensajeComponent,
    // CambiarComponent,
  ],
})
export class PagesModule {
}
