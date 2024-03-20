import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { EfectosPage } from './efectos.page';

const routes: Routes = [
  {
    path: '',
    component: EfectosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class EfectosPageRoutingModule {}
