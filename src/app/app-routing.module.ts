import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OmniComponent } from './projects/omni/omni.component';

const routes: Routes = [
  { path: 'projects/omni', component: OmniComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
