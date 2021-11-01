import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MachineListComponent } from './machines/machine-list/machine-list.component';

const routes: Routes = [
  { path: '', component: MachineListComponent },
  { path: 'machine', component: MachineListComponent },
  { path: 'dashboard', component: DashboardComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
