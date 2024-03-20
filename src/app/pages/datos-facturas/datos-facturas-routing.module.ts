import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosFacturasPage } from './datos-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: DatosFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosFacturasPageRoutingModule {}
