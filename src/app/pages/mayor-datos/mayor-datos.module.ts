import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MayorDatosPageRoutingModule } from './mayor-datos-routing.module';

import { MayorDatosPage } from './mayor-datos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MayorDatosPageRoutingModule
  ],
  declarations: []
})
export class MayorDatosPageModule {}
