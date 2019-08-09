import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { OmniComponent } from './projects/omni/omni.component';
import { DayZeroComponent } from './projects/day-zero/day-zero.component';

const routes: Routes = [
  { path: 'projects/omni', component: OmniComponent },
  { path: 'projects/day-zero', component: DayZeroComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
