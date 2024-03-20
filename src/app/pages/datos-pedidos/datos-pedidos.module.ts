import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DatosPedidosPageRoutingModule } from './datos-pedidos-routing.module';

import { DatosPedidosPage } from './datos-pedidos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DatosPedidosPageRoutingModule
  ],
  declarations: []
})
export class DatosPedidosPageModule {}
