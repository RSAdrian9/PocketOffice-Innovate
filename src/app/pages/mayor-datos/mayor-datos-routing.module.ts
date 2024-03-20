import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MayorDatosPage } from './mayor-datos.page';

const routes: Routes = [
  {
    path: '',
    component: MayorDatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MayorDatosPageRoutingModule {}
