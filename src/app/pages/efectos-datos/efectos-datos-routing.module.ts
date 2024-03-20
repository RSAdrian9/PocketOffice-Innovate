import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EfectosDatosPage } from './efectos-datos.page';

const routes: Routes = [
  {
    path: '',
    component: EfectosDatosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EfectosDatosPageRoutingModule {}
