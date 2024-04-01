import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Korisnik, Predmet } from '../models';

@Component({
  selector: 'app-nastavnikreg2',
  templateUrl: './nastavnikreg2.component.html',
  styleUrls: ['./nastavnikreg2.component.css']
})
export class Nastavnikreg2Component implements OnInit{
  predmeti: string[] = [];
  uzrasti: string[] = [];
  izvorpitanje: string = "";
  msg: string = "";
  dodatnipredmet: string = ""
  novi: Boolean = false;
  nastavnik: Korisnik = new Korisnik()
  cv: File| undefined
  svipredmeti: Predmet[] = [];

  /*svipredmeti: string[] = [
    "Matematika", "Fizika", "Hemija", "Informatika",
    "Programiranje", "Srpski jezik i književnost",
    "Engleski jezik", "Nemački jezik", "Italijanski jezik",
    "Francuski jezik", "Španski jezik", "Latinski jezik",
    "Biologija", "Istorija", "Geografija", "Svet oko nas"
  ];*/

  sviuzrasti: string[] = [
    'osnovna 1-4', 'osnovna 5-8', 'srednja'
  ];

  constructor(private router: Router, private service: UserService) {}

  ngOnInit(): void {
    this.nastavnik = JSON.parse(localStorage.getItem("newNastavnik")!)
    this.service.getSviPredmeti().subscribe(data=>{
      this.svipredmeti = data
    })
  }

  registerNastavnik(): void {
    if (this.predmeti.length === 0 || this.uzrasti.length === 0 || this.izvorpitanje === "") {
      this.msg = 'Unesite bar jedan odgovor na svako od pitanja';
      return;
    }
    if (this.cv == undefined || this.cv.name == "") {
      this.msg = 'CV je obavezan';
      return;
    }
    const maxFileSizeInMB = 3;
    const maxFileSizeInBytes = maxFileSizeInMB * 1024 * 1024;
    if (this.cv.size > maxFileSizeInBytes) {
      this.msg = 'CV ne sme biti veći od 3MB.';
      return;
    }
    this.msg = ""
    console.log(this.nastavnik)
    this.nastavnik.predmeti = this.predmeti
    this.nastavnik.uzrasti = this.uzrasti
    this.nastavnik.izvorpitanje = this.izvorpitanje
    this.nastavnik.status = "pending"
    console.log(this.nastavnik)
    this.service.dodajCV(this.nastavnik.korisnicko_ime, this.cv).subscribe(data=>{
      console.log(data)
      this.service.korak2(this.nastavnik.korisnicko_ime, this.predmeti, this.uzrasti, this.izvorpitanje).subscribe(data=>{
        console.log(data.msg)
        this.msg = "Uspeh"
        this.sent = true
      },
      error=>{
        this.msg = error.error.error
      })
    },
    error=>{
      this.msg = error.error.error
    })
  }
  sent: boolean = false
  selectPredmet(p: string): void {
      if (this.predmeti.includes(p)) {
        this.predmeti = this.predmeti.filter(s => s !== p);
      } else {
        this.predmeti.push(p);
      }
    console.log(this.predmeti);
  }

  selectUzrast(u: string): void {
    if (this.uzrasti.includes(u)) {
      this.uzrasti = this.uzrasti.filter(a => a !== u);
    } else {
      this.uzrasti.push(u);
    }
    console.log(this.uzrasti)
  }


  selectNoviPredmet(): void {
    if(this.dodatnipredmet=="") {
      console.log(this.predmeti)
      this.novi = !this.novi
      return}
    this.novi = !this.novi

    if (this.predmeti.includes(this.dodatnipredmet)) {
      this.predmeti = this.predmeti.filter(s => s !== this.dodatnipredmet);
    } else {
      this.predmeti.push(this.dodatnipredmet);
    }

    if (!this.novi) {
      this.dodatnipredmet = '';
    }
    console.log(this.predmeti)
  }

  promenaCV(event: any): void {
    const file = event.target.files[0];
    if (file) {
        this.cv = file;
    }
  }

  pocetna(){
    this.router.navigate([''])
  }

}
