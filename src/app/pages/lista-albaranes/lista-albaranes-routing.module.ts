import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaAlbaranesPage } from './lista-albaranes.page';

const routes: Routes = [
  {
    path: '',
    component: ListaAlbaranesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaAlbaranesPageRoutingModule {}
