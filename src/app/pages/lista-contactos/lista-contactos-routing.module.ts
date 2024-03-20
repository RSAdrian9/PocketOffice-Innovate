import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaContactosPage } from './lista-contactos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaContactosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaContactosPageRoutingModule {}
