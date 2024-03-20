import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { EfectosPageRoutingModule } from './efectos-routing.module';

import { EfectosPage } from './efectos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    EfectosPageRoutingModule
  ],
  declarations: []
})
export class EfectosPageModule {}
