import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ListaBancosPage } from './lista-bancos.page';

const routes: Routes = [
  {
    path: '',
    component: ListaBancosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ListaBancosPageRoutingModule {}
