import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosFacturasPageRoutingModule } from './datos-facturas-routing.module';

import { DatosFacturasPage } from './datos-facturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosFacturasPageRoutingModule
  ],
  declarations: []
})
export class DatosFacturasPageModule {}
