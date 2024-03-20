import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { SituacionRiesgosPageRoutingModule } from './situacion-riesgos-routing.module';

import { SituacionRiesgosPage } from './situacion-riesgos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    SituacionRiesgosPageRoutingModule
  ],
  declarations: []
})
export class SituacionRiesgosPageModule {}
