import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ResumenMesualVentasPage } from './resumen-mesual-ventas.page';

const routes: Routes = [
  {
    path: '',
    component: ResumenMesualVentasPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ResumenMesualVentasPageRoutingModule {}
