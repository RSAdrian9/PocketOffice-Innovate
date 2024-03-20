import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { VistaClientePageRoutingModule } from './vista-cliente-routing.module';

import { VistaClientePage } from './vista-cliente.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    VistaClientePageRoutingModule
  ],
  declarations: []
})
export class VistaClientePageModule {}
