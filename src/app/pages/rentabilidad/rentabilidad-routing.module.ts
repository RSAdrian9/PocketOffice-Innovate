import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { RentabilidadPage } from './rentabilidad.page';

const routes: Routes = [
  {
    path: '',
    component: RentabilidadPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class RentabilidadPageRoutingModule {}
