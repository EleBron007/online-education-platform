import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UcenikComponent } from './ucenik/ucenik.component';
import { NastavnikComponent } from './nastavnik/nastavnik.component';
import { AdminComponent } from './admin/admin.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { PocetnaComponent } from './pocetna/pocetna.component';
import { AdminpocetnaComponent } from './adminpocetna/adminpocetna.component';
import { UcenikregComponent } from './ucenikreg/ucenikreg.component';
import { NastavnikregComponent } from './nastavnikreg/nastavnikreg.component';
import { Nastavnikreg2Component } from './nastavnikreg2/nastavnikreg2.component';
import { PromenalozinkeComponent } from './promenalozinke/promenalozinke.component';
import { NastavnikdetComponent } from './nastavnikdet/nastavnikdet.component';
import { UcenikdetComponent } from './ucenikdet/ucenikdet.component';
import { KorisnikupdateComponent } from './korisnikupdate/korisnikupdate.component';
import { ChartComponent } from './chart/chart.component'
import { NgChartsModule } from 'ng2-charts';
import { HeaderComponent } from './header/header.component';
import { FooterComponent } from './footer/footer.component';

@NgModule({
  declarations: [
    AppComponent,
    UcenikComponent,
    NastavnikComponent,
    AdminComponent,
    PocetnaComponent,
    AdminpocetnaComponent,
    UcenikregComponent,
    NastavnikregComponent,
    Nastavnikreg2Component,
    PromenalozinkeComponent,
    NastavnikdetComponent,
    UcenikdetComponent,
    KorisnikupdateComponent,
    ChartComponent,
    HeaderComponent,
    FooterComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
    NgChartsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
