import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaPresupuestosPage } from './lista-presupuestos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaPresupuestosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaPresupuestosPageRoutingModule {}
