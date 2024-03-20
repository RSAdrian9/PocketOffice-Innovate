import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosDireccionesPageRoutingModule } from './datos-direcciones-routing.module';

import { DatosDireccionesPage } from './datos-direcciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosDireccionesPageRoutingModule
  ],
  declarations: []
})
export class DatosDireccionesPageModule {}
