import { NgModule } from '@angular/core';
import {
  NbActionsModule,
  NbButtonModule,
  NbCardModule,
  NbTabsetModule,
  NbUserModule,
  NbRadioModule,
  NbCheckboxModule,
  NbAlertModule,
  NbSpinnerModule,
  NbSelectModule,
  NbListModule,
  NbIconModule,
} from '@nebular/theme';
import { NgxEchartsModule } from 'ngx-echarts';

import { ThemeModule } from '../../@theme/theme.module';
import { DashboardComponent } from './dashboard.component';
import { StatusCardComponent } from './status-card/status-card.component';
import { ContactsComponent } from './contacts/contacts.component';
import { KittenComponent } from './kitten/kitten.component';
import { SolarComponent } from './solar/solar.component';
import { FormsModule } from '@angular/forms';
import { NgxPrintModule } from 'ngx-print';

@NgModule({
  imports: [
    FormsModule,
    ThemeModule,
    NbCardModule,
    NbUserModule,
    NbSpinnerModule,
    NbButtonModule,
    NbTabsetModule,
    NbActionsModule,
    NbCheckboxModule,
    NbAlertModule,
    NbRadioModule,
    NbSelectModule,
    NbCheckboxModule,
    NbListModule,
    NbIconModule,
    NbButtonModule,
    NgxEchartsModule,
    NgxPrintModule,
  ],
  declarations: [
    DashboardComponent,
    StatusCardComponent,
    ContactsComponent,
    KittenComponent,
    SolarComponent,
  ],
})
export class DashboardModule { }
