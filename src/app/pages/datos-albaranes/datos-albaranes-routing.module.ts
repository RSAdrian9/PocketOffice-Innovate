import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DatosAlbaranesPage } from './datos-albaranes.page';

const routes: Routes = [
  {
    path: '',
    component: DatosAlbaranesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DatosAlbaranesPageRoutingModule {}
