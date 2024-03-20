import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaBancosPageRoutingModule } from './lista-bancos-routing.module';

import { ListaBancosPage } from './lista-bancos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaBancosPageRoutingModule
  ],
  declarations: []
})
export class ListaBancosPageModule {}
