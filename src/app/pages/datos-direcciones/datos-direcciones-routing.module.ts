import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosDireccionesPage } from './datos-direcciones.page';

const routes: Routes = [
  {
    path: '',
    component: DatosDireccionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosDireccionesPageRoutingModule {}
