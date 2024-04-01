import { Component } from '@angular/core';
import { Cas, Korisnik, Predmet } from '../models';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-nastavnik',
  templateUrl: './nastavnik.component.html',
  styleUrls: ['./nastavnik.component.css']
})
export class NastavnikComponent {
  korisnik: Korisnik | undefined
  oldKorisnik: Korisnik | undefined
  isEditingProfile: boolean = false;
  msg: string = ""
  isUvecajClicked: boolean = false;
  originalNastavnici: Korisnik[] = [];
  //allPredmeti: Predmet[] = [];
  svicasovi: Cas[] = []
  prosliCasovi: Cas[] = []
  buduciCasovi: Cas[] = []
  opcija: string = "profil"
  slikab: any = null
  predmeti: string[] = [];
  uzrasti: string[] = [];
  dodatnipredmet: string = ""
  novi: Boolean = false;
  zahtevi: Cas[] = []
  mojiUcenici: Korisnik[] = []
  sviPredmeti: Predmet[] = []

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

  constructor(private router: Router, private service: UserService, private sanitizer: DomSanitizer){}

  ngOnInit(): void {
    const loggedUser = JSON.parse(localStorage.getItem('logged')!);
    console.log(loggedUser)
    if (loggedUser && loggedUser.tip === 'nastavnik') {
      this.oldKorisnik = loggedUser;
      this.korisnik = JSON.parse(JSON.stringify(this.oldKorisnik));
    }
    console.log(this.korisnik)

    this.service.getKorisnik(this.korisnik!.korisnicko_ime).subscribe(
      (data: Korisnik) => {
        this.oldKorisnik = JSON.parse(JSON.stringify(data));
        this.korisnik = JSON.parse(JSON.stringify(data));
        this.uzrasti = this.korisnik!.uzrasti
        this.predmeti = this.korisnik!.predmeti
          this.service.dohvatiSliku(this.korisnik?.profilna_slika_path!).subscribe((data) => {
            const urlCreator = window.URL || window.webkitURL;
            this.slikab = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
            this.service.getCasoviBuducnost(this.korisnik!.korisnicko_ime).subscribe(data=>{
              this.buduciCasovi = data
              this.organizeBuduciCasovi();
              this.service.getZahtevi(this.korisnik!.korisnicko_ime).subscribe(data=>{
                this.zahtevi = data
                console.log(this.zahtevi)
                this.service.getMojiUcenici(this.korisnik!.korisnicko_ime).subscribe(data=>{
                    this.mojiUcenici = data
                    this.service.getSviPredmeti().subscribe(data=>{
                      this.sviPredmeti = data
                      this.dodatnipredmet = this.korisnik?.predmeti.find(subject => !this.sviPredmeti.some(predmet => predmet.predmet === subject)) || "";
                      this.service.getAllCasovi().subscribe(data=>{
                        this.svicasovi = data

                        /*this.mojiUcenici.forEach(mojiUcenik => {
                          const relevantCasovi = this.svicasovi.filter(cas =>
                              cas.ucenik === mojiUcenik.korisnicko_ime &&
                              (cas.ocena !== 0 && cas.ocena !== null)
                          );

                          if (relevantCasovi.length > 0) {
                              const sumOcena = relevantCasovi.reduce((sum, cas) => sum + cas.ocena, 0);
                              const averageOcena = sumOcena / relevantCasovi.length;
                              mojiUcenik.ocena = averageOcena;
                          } else {

                              mojiUcenik.ocena = 0;
                          }
                      });*/


                      })

                    })
                  })
              })
            })
          });
      },
      (error) => {
        console.error('Greska pri dohvatanju korisnika', error);
      }
    );
  }

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
    this.predmeti = this.predmeti.filter(predmet =>
      this.sviPredmeti.some(item => item.predmet === predmet)
    );
    return
  }
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


  promenaLozinke(){
    this.router.navigate(['promenalozinke'])
  }

  editProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
  }

  saveProfile(): void {
    if (!this.korisnik!.ime || !this.korisnik!.prezime || !this.korisnik!.adresa ||
        !this.korisnik!.email_adresa || !this.korisnik!.kontakt_telefon) {
      this.msg = "Sva polja su obavezna";
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.korisnik!.email_adresa)) {
      this.msg = "Greska u email adresi";
      return;
    }

    const phoneRegex = /^\+\d{10,15}$/;
    if (!phoneRegex.test(this.korisnik!.kontakt_telefon)) {
      this.msg = "Greska u broju telefona";
      return;
    }

    if(this.predmeti.length == 0){
      this.msg = "Unesite bar 1 predmet"
      return;
    }
    if(this.uzrasti.length == 0){
      this.msg = "Unesite bar 1 uzrast"
      return;
    }
    this.msg = ""
    if (this.slika && this.slika?.name !== "") {
      if (!['image/png', 'image/jpg', 'image/jpeg'].includes(this.slika.type)) {
        this.msg = 'Slika mora biti u formatu PNG ili JPG.';
        return;
      }

      this.checkImageDimensions(this.slika)
        .then((isValidDimensions) => {
          if (!isValidDimensions) {
            this.msg = 'Dimenzije slike moraju biti između 100x100 i 300x300 piksela.';
            console.log(this.msg);
            return;
          }


          this.msg = "";
          this.korisnik!.predmeti = [...this.predmeti]
          this.korisnik!.uzrasti = [...this.uzrasti]
          console.log("KORISNIK")
          console.log(this.korisnik)
          this.service.updateKorisnik(this.korisnik!).subscribe(data => {
            console.log("received");
            console.log(data);
            this.service.dodajSliku(this.korisnik!.korisnicko_ime, this.slika!).subscribe(data => {
              console.log(data);
              this.isEditingProfile = false;
              this.isUvecajClicked = false;
              this.msg = "";
              this.ngOnInit();
            });
          });
        });
    } else {

      this.msg = "";
      this.korisnik!.predmeti = [...this.predmeti]
      this.korisnik!.uzrasti = [...this.uzrasti]
      this.service.updateKorisnik(this.korisnik!).subscribe(data => {
        console.log("received");
        console.log(data);
        this.isEditingProfile = false;
        this.isUvecajClicked = false;
        this.msg = "";
        this.ngOnInit();
      });
    }
  }

  cancelEdit(): void {
    this.isEditingProfile = false;
    this.korisnik = JSON.parse(localStorage.getItem('logged')!)
    this.msg = ""
    this.ngOnInit()
  }


  slika: File | undefined

  promenaSlike(event: any): void {
    const file = event.target.files[0];
    if (file) {
        this.slika = file;
    }
  }

  checkImageDimensions(file: File): Promise<boolean> {
    return new Promise((resolve) => {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        console.log(image.height);
        console.log(image.width);
        const isValidDimensions = image.width >= 100 && image.height >= 100 && image.width <= 300 && image.height <= 300;
        resolve(isValidDimensions);
      };
    });
  }

  udjiUUcionicu(cas: Cas): void {

  }

  change(opcija: string){
    this.opcija = opcija
  }

  organizeBuduciCasovi(){
    this.buduciCasovi.sort((a, b) => {
      const dateA = new Date(a.vremeod);
      const dateB = new Date(b.vremeod);

      if (dateA < dateB) return -1;
      if (dateA > dateB) return 1;
      return 0;
    });

    const currentDate = new Date();

    const za3dana = new Date(currentDate);
    za3dana.setDate(currentDate.getDate() + 3);

    this.buduciCasovi = this.buduciCasovi.filter(cas => {
      const casDate = new Date(cas.vremeod);
      return casDate > currentDate && casDate <= za3dana;
    }).filter(c => {
      return c.prihvacen=='accepted'
    })

    this.buduciCasovi = this.buduciCasovi.slice(0, 5);
  }

  provera15(cas: Cas): boolean {
    const currentTime = new Date();
    const classTime = new Date(cas.vremeod);

    const timeDifference = classTime.getTime() - currentTime.getTime();
    const minutesDifference = timeDifference / (1000 * 60);

    return minutesDifference < 15 && minutesDifference > 0;
  }

  odobriZahtev(zahtev: Cas){
    this.msg = ""
    console.log(zahtev)
    this.service.odobriZahtev(zahtev).subscribe(data=>{
      console.log(data)
      this.ngOnInit()
    })
  }

  odbijZahtev(zahtev: Cas){
    if(zahtev.obrazlozenje == ""){
      this.msg = "Unesite obrazlozenje"
      return
    }
    this.msg = ""
    console.log(zahtev)
    this.service.odbijZahtev(zahtev).subscribe(data=>{
      console.log(data)
      this.ngOnInit()
    })
  }

  getAverageOcena(u: string): number {
    const ucenik = this.mojiUcenici.find(ucenik => ucenik.korisnicko_ime === u);
    if (ucenik) {
        const relevantCasovi = this.svicasovi.filter(cas =>
            cas.ucenik === u && (cas.ocena !== 0 && cas.ocena !== null)
        );
        if (relevantCasovi.length > 3) {
            const sumOcena = relevantCasovi.reduce((sum, cas) => sum + cas.ocena, 0);
            const averageOcena = sumOcena / relevantCasovi.length;
            return parseFloat(averageOcena.toFixed(2));
        } else {
            return 0;
        }
    } else {
        return 0;
    }
}



}
