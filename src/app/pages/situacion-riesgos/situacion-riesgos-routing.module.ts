import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SituacionRiesgosPage } from './situacion-riesgos.page';

const routes: Routes = [
  {
    path: '',
    component: SituacionRiesgosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SituacionRiesgosPageRoutingModule {}
