import { Component, OnInit } from '@angular/core';
import { Cas, Korisnik, Predmet } from '../models';
import { UserService } from '../user.service';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-ucenik',
  templateUrl: './ucenik.component.html',
  styleUrls: ['./ucenik.component.css']
})
export class UcenikComponent implements OnInit{

  korisnik: Korisnik | undefined
  oldKorisnik: Korisnik | undefined
  isEditingProfile: boolean = false;
  msg: string = ""
  isUvecajClicked: boolean = false;
  actNastavnici: Korisnik[] = []
  originalNastavnici: Korisnik[] = [];
  allPredmeti: Predmet[] = [];
  svicasovi: Cas[] = []
  prosliCasovi: Cas[] = []
  buduciCasovi: Cas[] = []
  opcija: string = "profil"
  svipredmeti: Predmet[] = []

  searchParamIme: string = '';
  searchParamPrezime: string = '';
  searchParamPredmeti: string = '';
  sortOption: string = 'ime';
  sortOrder: string = 'asc';


  constructor(private router: Router, private service: UserService, private sanitizer: DomSanitizer){}
  slikab: any = null;
  ngOnInit(): void {
    this.isUvecajClicked = false
    const loggedUser = JSON.parse(localStorage.getItem('logged')!);
    if (loggedUser && loggedUser.tip === 'ucenik') {
      this.oldKorisnik = loggedUser;
      this.korisnik = JSON.parse(JSON.stringify(this.oldKorisnik));
    }

    this.service.getKorisnik(this.korisnik!.korisnicko_ime).subscribe(
      (data: Korisnik) => {
        this.oldKorisnik = JSON.parse(JSON.stringify(data));
        this.korisnik = JSON.parse(JSON.stringify(data));
          this.service.dohvatiSliku(this.korisnik?.profilna_slika_path!).subscribe((data) => {
            const urlCreator = window.URL || window.webkitURL;
            this.slikab = this.sanitizer.bypassSecurityTrustUrl(urlCreator.createObjectURL(data));
            this.service.getNastavnici().subscribe(data=>{
              this.actNastavnici = data
                  .filter(nastavnik => {

                      const ucenikTip = loggedUser.tip_skole;
                      const ucenikRazred = loggedUser.trenutni_razred;
                      console.log(ucenikTip)
                      console.log(ucenikRazred)
                      if (
                        (ucenikTip.includes('srednja') && nastavnik.uzrasti.includes('srednja')) ||
                        (ucenikTip=='osnovna' && (
                          (ucenikRazred < 5 && nastavnik.uzrasti.includes('osnovna 1-4')) ||
                          (ucenikRazred >= 5 && nastavnik.uzrasti.includes('osnovna 5-8'))
                        ))
                      ) {
                        console.log(true)
                        return true;
                      } else {
                        console.log(false)
                        return false;
                      }
                  });
              this.originalNastavnici = [...this.actNastavnici]; // Copy
              this.fillPredmet()
              this.service.getCasoviUcenik(this.korisnik?.korisnicko_ime!).subscribe(data=>{
                this.svicasovi = data;
                this.svicasovi.sort((a, b) => {
                  const dateA = new Date(a.vremeod);
                  const dateB = new Date(b.vremeod);

                  if (dateA > dateB) return -1;
                  if (dateA < dateB) return 1;
                  return 0;
                });

                console.log(this.svicasovi)
                this.prosliCasovi = [...this.svicasovi].filter(cas => {
                  return new Date(cas.vremedo) < new Date
                })
                this.buduciCasovi = [...this.svicasovi].filter(cas => {
                  return new Date(cas.vremeod) > new Date
                })
                this.buduciCasovi.sort((a, b) => {
                  const dateA = new Date(a.vremeod);
                  const dateB = new Date(b.vremeod);

                  if (dateA < dateB) return -1;
                  if (dateA > dateB) return 1;
                  return 0;
                });

                this.service.getSviPredmeti().subscribe(data=>{
                  this.svipredmeti = data
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

  editProfile(): void {
    this.isEditingProfile = !this.isEditingProfile;
  }



  saveProfile(): void {
    if (!this.korisnik!.ime || !this.korisnik!.prezime || !this.korisnik!.adresa ||
        !this.korisnik!.email_adresa || !this.korisnik!.kontakt_telefon || !this.korisnik!.tip_skole) {
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

    if (this.korisnik!.tip_skole === "osnovna") {
      if (this.korisnik!.trenutni_razred < 1 || this.korisnik!.trenutni_razred > 8) {
        this.msg = "Greska u razredu";
        return;
      }
    } else {
      if (this.korisnik!.trenutni_razred < 1 || this.korisnik!.trenutni_razred > 4) {
        this.msg = "Greska u razredu";
        return;
      }
    }

    if (this.korisnik!.trenutni_razred > 8 && this.korisnik!.tip_skole === "osnovna") {
      this.msg = "Greska u razredu";
      return;
    }


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
    this.ngOnInit()
  }

  incrementGrade(): void {
    if (!this.isUvecajClicked) {
      if(this.korisnik?.trenutni_razred == 8 && this.korisnik.tip_skole == 'osnovna'){
        this.msg = "Promenite tip skole"
        return
      }
        this.msg = ""
        this.korisnik!.trenutni_razred++;
        if(this.korisnik!.trenutni_razred == 9)
          this.korisnik!.trenutni_razred = 1
        this.isUvecajClicked = true;


    }
  }

  promenaLozinke(){
    this.router.navigate(['promenalozinke'])
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

  sort(): void {
    this.actNastavnici = this.performSorting([...this.actNastavnici]);
  }

  search(): void {
    this.actNastavnici = this.performSearch([...this.originalNastavnici]);
    this.actNastavnici = this.performSorting([...this.actNastavnici]);
  }

  performSorting(data: Korisnik[]): Korisnik[] {
    return data.sort((a, b) => {
      const valueA = this.getSortValue(a);
      const valueB = this.getSortValue(b);

      if (this.sortOrder === 'asc') {
        return valueA.localeCompare(valueB);
      } else {
        return valueB.localeCompare(valueA);
      }
    });
  }

  performSearch(data: Korisnik[]): Korisnik[] {
    const searchImeLower = this.searchParamIme.toLowerCase();
    const searchPrezimeLower = this.searchParamPrezime.toLowerCase();
    const searchPredmetiLower = this.searchParamPredmeti.toLowerCase();

    return data.filter(teacher =>
      (teacher.ime.toLowerCase().includes(searchImeLower) || searchImeLower === '') &&
      (teacher.prezime.toLowerCase().includes(searchPrezimeLower) || searchPrezimeLower === '') &&
      (teacher.predmeti.join(', ').toLowerCase().includes(searchPredmetiLower) || searchPredmetiLower === '')
    );
  }

  getSortValue(teacher: Korisnik): string {
    switch (this.sortOption) {
      case 'ime':
        return teacher.ime.toLowerCase();
      case 'prezime':
        return teacher.prezime.toLowerCase();
      case 'predmet':
        return teacher.predmeti.join(', ').toLowerCase();
      default:
        return '';
    }
  }



  /*svipredmeti: string[] = [
    "Matematika", "Fizika", "Hemija", "Informatika",
    "Programiranje", "Srpski jezik i književnost",
    "Engleski jezik", "Nemački jezik", "Italijanski jezik",
    "Francuski jezik", "Španski jezik", "Latinski jezik",
    "Biologija", "Istorija", "Geografija", "Svet oko nas"
  ];*/

  fillPredmet(){
    const allSubjects: Set<string> = new Set<string>();

    this.svipredmeti.forEach(predmet => {
      allSubjects.add(predmet.predmet);
    });

    this.actNastavnici.forEach(nastavnik => {
      nastavnik.predmeti.forEach(predmet => {
        allSubjects.add(predmet);
      });
    });

    this.allPredmeti = Array.from(allSubjects).map(predmet => {
      const professors: string[] = this.actNastavnici
        .filter(nastavnik => nastavnik.predmeti.includes(predmet))
        .map(nastavnik => `${nastavnik.ime} ${nastavnik.prezime}`);

      return {
        predmet: predmet,
        profesor: professors
      };
    });
  }

  filterRazred(data: Korisnik[]){
    const tmpNastavnici = data
    .filter(nastavnik => {
      if (this.korisnik!.tip === 'ucenik') {
        const ucenikTip = this.korisnik!.tip_skole;
        const ucenikRazred = this.korisnik!.trenutni_razred;

        if (
          (ucenikTip === 'srednja' && nastavnik.uzrasti.includes('srednja')) ||
          (ucenikTip === 'osnovna' && (
            (ucenikRazred < 5 && nastavnik.uzrasti.includes('1-4')) ||
            (ucenikRazred >= 5 && nastavnik.uzrasti.includes('5-8'))
          ))
        ) {
          return true;
        } else {
          return false;
        }
      } else {
        return true;
      }
    });
    return tmpNastavnici;
  }

  provera15(cas: Cas): boolean {
    const currentTime = new Date();
    const classTime = new Date(cas.vremeod);

    const timeDifference = classTime.getTime() - currentTime.getTime();
    const minutesDifference = timeDifference / (1000 * 60);

    return minutesDifference < 15 && minutesDifference > 0;
  }

  udjiUUcionicu(cas: Cas): void {

  }

  change(opcija: string){
    this.opcija = opcija
  }



}
