import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosContactosPage } from './datos-contactos.page';

const routes: Routes = [
  {
    path: '',
    component: DatosContactosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosContactosPageRoutingModule {}
