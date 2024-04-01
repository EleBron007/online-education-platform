import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Korisnik } from '../models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent {

  constructor(private router: Router) {}

  korisnik: Korisnik | undefined

  odjaviSe() {
    localStorage.clear();
    this.router.navigate(['']);
  }


  registerUcenik() {
    this.router.navigate(['ucenikreg'])
  }

  registerNastavnik() {
    this.router.navigate(['nastavnikreg'])
  }

  promenaLozinke(){
    this.router.navigate(['promenalozinke'])
  }

  mojProfil(){
    const k = localStorage.getItem("logged")
    if(!k || k == ""){
      localStorage.clear();
      this.router.navigate(['']);
    }
    if(k){
      this.korisnik = JSON.parse(k)
      if(this.korisnik!.tip == "ucenik"){
        this.router.navigate(['ucenik'])
      }
      if(this.korisnik!.tip == "nastavnik"){
        this.router.navigate(['nastavnik'])
      }
    }

  }
}
