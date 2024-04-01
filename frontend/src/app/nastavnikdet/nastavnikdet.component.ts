import { ApplicationRef, Component, OnInit } from '@angular/core';
import { Cas, Korisnik } from '../models';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '../user.service';
import { DomSanitizer } from '@angular/platform-browser';
//import { time } from 'console';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-nastavnikdet',
  templateUrl: './nastavnikdet.component.html',
  styleUrls: ['./nastavnikdet.component.css']
})
export class NastavnikdetComponent implements OnInit{
  nastavnikId: string = ""
  nastavnik: Korisnik | undefined
  ucenik: Korisnik | undefined
  odabraniPr: string = ""
  odabranoVremeOd: string = ""
  komentar: string = ""
  dupli: boolean = false;
  slikab: any = null
  cas: Cas = new Cas()
  buduci: Cas[] = []
  msg: string = ""
  trajanje: number = 60
  next: string = ""
  timeDifferences: TimeDifference[] = [];


  constructor(
    private route: ActivatedRoute,
    private service: UserService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private cdRef: ChangeDetectorRef,
    private appRef: ApplicationRef
  ) { }

  ngOnInit(): void {
    this.trajanje = 60
    this.cas = new Cas()
    this.odabraniPr = ""
    this.odabranoVremeOd = ""
    this.komentar = ""
    this.dupli = false;
    this.timeDifferences = []
    this.route.params.subscribe(params => {
      this.nastavnikId = params['id'];
      this.service.getKorisnik(this.nastavnikId).subscribe(details => {
        this.nastavnik = details;
        this.ucenik = JSON.parse(localStorage.getItem("logged")!)
        this.odabraniPr = this.nastavnik.predmeti[0]
        this.service.dohvatiSliku(this.nastavnik?.profilna_slika_path!).subscribe((data) => {
          const urlCreator = window.URL || window.webkitURL;
          this.slikab = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
          this.service.getCasoviBuducnost(this.nastavnik?.korisnicko_ime!).subscribe(data =>{
            this.buduci = data.sort((a, b) => {
              const dateA = new Date(a.vremeod);
              const dateB = new Date(b.vremeod);

              if (dateA < dateB) return -1;
              if (dateA > dateB) return 1;
              return 0;
            });
            console.log("Buduci")
            console.log(this.buduci)
            this.next = ""
            this.cdRef.detectChanges();
          })
        });
      });
    })
  }

  zakaziCas(){
    if(this.odabraniPr == ""){
      this.msg = "Predmet je obavezan"
      this.ngOnInit()
      return;
    }
    if(this.komentar == ""){
      this.msg = "Opis je obavezan"
      this.ngOnInit()
      return;
    }
    if(this.odabranoVremeOd == ""){
      this.msg = "Datum je obavezan"
      this.ngOnInit()
      return;
    }
    if(new Date(this.odabranoVremeOd) < new Date()){
      this.msg = "Datum mora da bude u buducnosti"
      this.ngOnInit()
      return;
    }
    if(this.dupli) this.trajanje = this.trajanje*2
    this.msg = ""
    this.cas.dupli=this.dupli
    this.cas.nastavnik = this.nastavnik?.korisnicko_ime!
    this.cas.predmet = this.odabraniPr
    this.cas.vremeod = this.odabranoVremeOd
    this.cas.komentar = this.komentar
    this.cas.ucenik = this.ucenik?.korisnicko_ime!
    this.cas.nastavnikPI = this.nastavnik!.ime + " " + this.nastavnik!.prezime
    this.cas.ucenikPI = this.ucenik!.ime + " " + this.ucenik!.prezime
    this.cas.prihvacen = "pending"
    const vremedoDate = new Date(this.cas.vremeod);

    if (this.dupli) {
      vremedoDate.setHours(vremedoDate.getHours() + 3);
    } else {
      vremedoDate.setHours(vremedoDate.getHours() + 2);
    }
    this.cas.vremedo = vremedoDate.toISOString()
    this.msg = ""
    const availabilityMessage = this.dostupan();
    if (availabilityMessage !== '') {
      this.msg = availabilityMessage;
      return;
    }
    console.log("-----------")
    console.log(this.next)
    console.log(this.cas.vremeod)
    if(new Date(this.next).getDate() != new Date(this.cas.vremeod).getDate()){
      this.msg = "Nema vise termina tog dana "
      this.ngOnInit()
      return
    }
    if(new Date(this.next).getHours() != new Date(this.cas.vremeod).getHours()){
      this.msg = this.formatDateAndNames(this.next)
      this.ngOnInit()
      return
    }
    this.msg = "Uspeh"

    this.service.napraviCas(this.cas).subscribe(data=>{
      console.log(data)
      console.log(data);

      this.odabraniPr = "";
      this.komentar = "";
      this.odabranoVremeOd = "";
      this.dupli = false;
      this.next = "";
      this.buduci = []
      this.ngOnInit()
      this.cdRef.detectChanges();
      const username = this.nastavnik?.korisnicko_ime;
      //this.router.navigate(['teacher', username ])
    })
  }

  dostupan(): string {
    const pocetakNovi = new Date(this.cas.vremeod);
    const zavrsetakNovi = new Date(this.cas.vremedo);
    const endOfWeek = new Date(pocetakNovi);
    endOfWeek.setDate(pocetakNovi.getDate() + (6 - pocetakNovi.getDay())); // Set (Sunday)

    const filteredBuduci = this.buduci.filter(cas => {
      const zavrsetak = new Date(cas.vremedo);
      const pocetak = new Date(cas.vremeod);

      console.log(pocetakNovi)
      console.log(zavrsetakNovi)
      console.log(pocetak)
      console.log(zavrsetak)
      console.log((pocetak.getTime() >= zavrsetakNovi.getTime() || (pocetakNovi.getTime() < zavrsetak.getTime() && pocetakNovi.getTime() > pocetak.getTime()) ) && zavrsetak.getTime() <= endOfWeek.getTime())
      return (pocetak.getTime() >= zavrsetakNovi.getTime() || (pocetakNovi.getTime() < zavrsetak.getTime()-3600000 && pocetakNovi.getTime() > pocetak.getTime()) ) && zavrsetak.getTime() <= endOfWeek.getTime();
    });
    console.log(filteredBuduci);

    const updatedFilteredBuduci = [...filteredBuduci];

    updatedFilteredBuduci.unshift({
      vremeod: pocetakNovi.toISOString(),
      nastavnik: '',
      nastavnikPI: '',
      ucenik: '',
      ucenikPI: '',
      predmet: '',
      komentar: '',
      ocena: 0,
      vremedo: pocetakNovi.toISOString(),
      dupli: false,
      prihvacen: '',
      obrazlozenje: '',
      ocenjen: false
    });

    // Limiter at the end
    updatedFilteredBuduci.push({
      vremeod: endOfWeek.toISOString(),
      nastavnik: '',
      nastavnikPI: '',
      ucenik: '',
      ucenikPI: '',
      predmet: '',
      komentar: '',
      ocena: 0,
      vremedo: endOfWeek.toISOString(),
      dupli: false,
      prihvacen: '',
      obrazlozenje: '',
      ocenjen: false
    });

    console.log(updatedFilteredBuduci)

    for (let i = 0; i < updatedFilteredBuduci.length - 1; i++) {
      const currentCas = updatedFilteredBuduci[i];
      const nextCas = updatedFilteredBuduci[i + 1];

      const currentCasDate = new Date(currentCas.vremedo);
      const nextCasDate = new Date(nextCas.vremeod);

      const minutesDifference = Math.abs((nextCasDate.getTime() - currentCasDate.getTime()) / (1000 * 60));

      const timeDifferenceObj = new TimeDifference(minutesDifference, currentCas.vremedo);
      this.timeDifferences.push(timeDifferenceObj);
    }

    console.log(this.timeDifferences);
    this.timeDifferences = this.timeDifferences.filter(ts => {
      return ts.minutes >= this.trajanje})
    console.log(this.timeDifferences);

    if(this.timeDifferences.length == 0){
      return "Termini su zauzeti do kraja te nedelje"
    }

    this.next = this.timeDifferences[0].fullTimestamp
    return("")

  }

  dostupan1(): string {


    const pocetakNovi = new Date(this.cas.vremeod);
    const zavrsetakNovi = new Date(this.cas.vremedo);
    const endOfWeek = new Date(pocetakNovi);
    endOfWeek.setDate(pocetakNovi.getDate() + (5 - pocetakNovi.getDay())); // Set to Friday

    const vremeod = pocetakNovi.getHours();
    const vremedo = zavrsetakNovi.getHours();
    const dayOfWeek = pocetakNovi.getDay();
    // Set time to 6 PM
    endOfWeek.setHours(18);
    endOfWeek.setMinutes(0);
    endOfWeek.setSeconds(0);
    console.log(vremeod)
    console.log(vremedo)
    console.log(endOfWeek)
    console.log("CASOVI")


    if (vremeod < 10 || vremedo > 18 || dayOfWeek == 0 || dayOfWeek == 6) {
      return "Izvan radnog vremena";
    }



    const filteredBuduci = this.buduci.filter(cas => {
      const zavrsetak = new Date(cas.vremedo);
      const pocetak = new Date(cas.vremeod);
      console.log(pocetakNovi)
      console.log(zavrsetakNovi)
      console.log(pocetak)
      console.log(zavrsetak)
      console.log((pocetak.getTime() >= zavrsetakNovi.getTime() || (pocetakNovi.getTime() < zavrsetak.getTime()-3600000 && pocetakNovi.getTime() > pocetak.getTime()) ) && zavrsetak.getTime() <= endOfWeek.getTime())
      return (pocetak.getTime() >= zavrsetakNovi.getTime() || (pocetakNovi.getTime() < zavrsetak.getTime()-3600000 && pocetakNovi.getTime() > pocetak.getTime()) ) && zavrsetak.getTime() <= endOfWeek.getTime();
    });
    console.log(filteredBuduci);

    const updatedFilteredBuduci = [...filteredBuduci];

    updatedFilteredBuduci.unshift({
      vremeod: pocetakNovi.toISOString(),
      nastavnik: '',
      nastavnikPI: '',
      ucenik: '',
      ucenikPI: '',
      predmet: '',
      komentar: '',
      ocena: 0,
      vremedo: pocetakNovi.toISOString(),
      dupli: false,
      prihvacen: '',
      obrazlozenje: '',
      ocenjen: false
    });

    // Limiter at the end
    updatedFilteredBuduci.push({
      vremeod: endOfWeek.toISOString(),
      nastavnik: '',
      nastavnikPI: '',
      ucenik: '',
      ucenikPI: '',
      predmet: '',
      komentar: '',
      ocena: 0,
      vremedo: endOfWeek.toISOString(),
      dupli: false,
      prihvacen: '',
      obrazlozenje: '',
      ocenjen: false
    });

    console.log(updatedFilteredBuduci)

    for (let i = 0; i < updatedFilteredBuduci.length - 1; i++) {
      const currentCas = updatedFilteredBuduci[i];
      const nextCas = updatedFilteredBuduci[i + 1];

      const currentCasDate = new Date(currentCas.vremedo);
      const nextCasDate = new Date(nextCas.vremeod);

      if (currentCasDate.getHours() >= 18) {
          currentCasDate.setHours(18, 0, 0, 0);
      }

      if (nextCasDate.getHours() < 10) {
          nextCasDate.setHours(10, 0, 0, 0);
      }

      let minutesDifferenceUntil6PM = 0;
      if (currentCasDate.getDate() === nextCasDate.getDate()) {
          minutesDifferenceUntil6PM = Math.max(Math.min((currentCasDate.getTime() - currentCasDate.setHours(18, 0, 0, 0)) / (1000 * 60), 8 * 60), 0); // Maximum difference is until 6 PM (8 hours)
      } else {
          minutesDifferenceUntil6PM = Math.max(Math.min((currentCasDate.setHours(18, 0, 0, 0) - currentCasDate.getTime()) / (1000 * 60), 8 * 60), 0); // Maximum difference is until 6 PM (8 hours)
      }

      let minutesDifferenceFrom10AM = Math.max(Math.min((nextCasDate.getTime() - nextCasDate.setHours(10, 0, 0, 0)) / (1000 * 60), 14 * 60), 0); // Maximum difference is from 10 AM (14 hours)

      const timeDifferenceUntil6PM = new TimeDifference(minutesDifferenceUntil6PM, currentCas.vremedo);
      this.timeDifferences.push(timeDifferenceUntil6PM);

      const timeDifferenceFrom10AM = new TimeDifference(minutesDifferenceFrom10AM, currentCas.vremedo);
      this.timeDifferences.push(timeDifferenceFrom10AM);
  }

    console.log(this.timeDifferences);
    this.timeDifferences = this.timeDifferences.filter(ts => {
      return ts.minutes >= this.trajanje})
    console.log(this.timeDifferences);

    if(this.timeDifferences.length == 0){
      return "Termini su zauzeti do kraja te nedelje"
    }

    this.next = this.timeDifferences[0].fullTimestamp
    return("")

  }

  formatDateAndNames(isoDateString: string) {
    const months = [
        'januar', 'februar', 'mart', 'april', 'maj', 'jun',
        'jul', 'avgust', 'septembr', 'oktobr', 'novembr', 'decembr'
    ];

    const days = [
        'nedelja', 'ponedeljak', 'utorak', 'sreda', 'četvrtak', 'petak', 'subota'
    ];

    const date = new Date(isoDateString);
    const dayOfWeek = days[date.getDay()];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    const hour = date.getHours();
    const minute = date.getMinutes();

    return `Prvi sledeći termin je ${day}. ${month} ${year}. u ${hour}:${minute}`;
  }




}

class TimeDifference {
  minutes: number;
  fullTimestamp: string;

  constructor(minutes: number, fullTimestamp: string) {
    this.minutes = minutes;
    this.fullTimestamp = fullTimestamp;
  }


}

