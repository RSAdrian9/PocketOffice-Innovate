import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { VistaClientePage } from './vista-cliente.page';

const routes: Routes = [
  {
    path: '',
    component: VistaClientePage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VistaClientePageRoutingModule {}
