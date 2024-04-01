import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UcenikComponent } from './ucenik/ucenik.component';
import { NastavnikComponent } from './nastavnik/nastavnik.component';
import { AdminComponent } from './admin/admin.component';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { AdminpocetnaComponent } from './adminpocetna/adminpocetna.component';
import { UcenikregComponent } from './ucenikreg/ucenikreg.component';
import { NastavnikregComponent } from './nastavnikreg/nastavnikreg.component';
import { Nastavnikreg2Component } from './nastavnikreg2/nastavnikreg2.component';
import { PromenalozinkeComponent } from './promenalozinke/promenalozinke.component';
import { NastavnikdetComponent } from './nastavnikdet/nastavnikdet.component';
import { UcenikdetComponent } from './ucenikdet/ucenikdet.component';
import { KorisnikupdateComponent } from './korisnikupdate/korisnikupdate.component';

const routes: Routes = [
  {path : '', component: PocetnaComponent},
  {path: 'ucenik', component: UcenikComponent},
  {path: 'nastavnik', component: NastavnikComponent},
  {path: 'adminlogin', component: AdminpocetnaComponent},
  {path: 'admin', component: AdminComponent},
  {path: 'ucenikreg', component: UcenikregComponent},
  {path: 'nastavnikreg', component: NastavnikregComponent},
  {path: 'nastavnikreg/korak2', component: Nastavnikreg2Component},
  {path: 'promenalozinke', component: PromenalozinkeComponent},
  {path: 'teacher/:id', component: NastavnikdetComponent },
  {path: 'student/:id', component: UcenikdetComponent },
  {path: 'korisnikupdate', component: KorisnikupdateComponent },

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
