import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EfectosDatosPageRoutingModule } from './efectos-datos-routing.module';

import { EfectosDatosPage } from './efectos-datos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EfectosDatosPageRoutingModule
  ],
  declarations: []
})
export class EfectosDatosPageModule {}
