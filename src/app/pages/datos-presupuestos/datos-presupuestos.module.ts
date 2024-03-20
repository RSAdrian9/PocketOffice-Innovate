import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPresupuestosPageRoutingModule } from './datos-presupuestos-routing.module';

import { DatosPresupuestosPage } from './datos-presupuestos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPresupuestosPageRoutingModule
  ],
  declarations: []
})
export class DatosPresupuestosPageModule {}
