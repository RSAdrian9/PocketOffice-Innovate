import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { ListaAlbaranesPageRoutingModule } from './lista-albaranes-routing.module';

import { ListaAlbaranesPage } from './lista-albaranes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    ListaAlbaranesPageRoutingModule
  ],
  declarations: []
})
export class ListaAlbaranesPageModule {}
