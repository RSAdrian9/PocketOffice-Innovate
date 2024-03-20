import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MayorPageRoutingModule } from './mayor-routing.module';

import { MayorPage } from './mayor.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MayorPageRoutingModule
  ],
  declarations: []
})
export class MayorPageModule {}
