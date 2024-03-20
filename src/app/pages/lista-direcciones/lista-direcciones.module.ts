import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaDireccionesPageRoutingModule } from './lista-direcciones-routing.module';

import { ListaDireccionesPage } from './lista-direcciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaDireccionesPageRoutingModule
  ],
  declarations: []
})
export class ListaDireccionesPageModule {}
