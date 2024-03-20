import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosPedidosPage } from './datos-pedidos.page';

const routes: Routes = [
  {
    path: '',
    component: DatosPedidosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosPedidosPageRoutingModule {}
