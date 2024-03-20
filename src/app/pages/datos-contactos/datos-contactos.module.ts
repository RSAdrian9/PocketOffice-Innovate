import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosContactosPageRoutingModule } from './datos-contactos-routing.module';

import { DatosContactosPage } from './datos-contactos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosContactosPageRoutingModule
  ],
  declarations: []
})
export class DatosContactosPageModule {}
