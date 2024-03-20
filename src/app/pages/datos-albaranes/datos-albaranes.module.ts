import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosAlbaranesPageRoutingModule } from './datos-albaranes-routing.module';

import { DatosAlbaranesPage } from './datos-albaranes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosAlbaranesPageRoutingModule
  ],
  declarations: []
})
export class DatosAlbaranesPageModule {}
