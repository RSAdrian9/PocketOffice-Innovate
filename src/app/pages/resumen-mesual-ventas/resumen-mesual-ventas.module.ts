import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ResumenMesualVentasPageRoutingModule } from './resumen-mesual-ventas-routing.module';

import { ResumenMesualVentasPage } from './resumen-mesual-ventas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ResumenMesualVentasPageRoutingModule
  ],
  declarations: []
})
export class ResumenMesualVentasPageModule {}
