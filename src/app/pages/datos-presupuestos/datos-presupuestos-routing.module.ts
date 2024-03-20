import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPresupuestosPage } from './datos-presupuestos.page';

const routes: Routes = [
  {
    path: '',
    component: DatosPresupuestosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPresupuestosPageRoutingModule {}
