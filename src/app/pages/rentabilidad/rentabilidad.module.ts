import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { RentabilidadPageRoutingModule } from './rentabilidad-routing.module';

import { RentabilidadPage } from './rentabilidad.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RentabilidadPageRoutingModule
  ],
  declarations: []
})
export class RentabilidadPageModule {}
