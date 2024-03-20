import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MayorPage } from './mayor.page';

const routes: Routes = [
  {
    path: '',
    component: MayorPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MayorPageRoutingModule {}
