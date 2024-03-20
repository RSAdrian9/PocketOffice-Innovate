import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosBancariosPage } from './datos-bancarios.page';

const routes: Routes = [
  {
    path: '',
    component: DatosBancariosPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosBancariosPageRoutingModule {}
