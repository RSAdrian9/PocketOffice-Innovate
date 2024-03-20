import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaFacturasPageRoutingModule } from './lista-facturas-routing.module';

import { ListaFacturasPage } from './lista-facturas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaFacturasPageRoutingModule
  ],
  declarations: []
})
export class ListaFacturasPageModule {}
