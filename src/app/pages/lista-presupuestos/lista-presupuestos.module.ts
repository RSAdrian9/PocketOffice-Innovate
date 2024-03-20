import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaPresupuestosPageRoutingModule } from './lista-presupuestos-routing.module';

import { ListaPresupuestosPage } from './lista-presupuestos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaPresupuestosPageRoutingModule
  ],
  declarations: []
})
export class ListaPresupuestosPageModule {}
