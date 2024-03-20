import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaFacturasPage } from './lista-facturas.page';

const routes: Routes = [
  {
    path: '',
    component: ListaFacturasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaFacturasPageRoutingModule {}
