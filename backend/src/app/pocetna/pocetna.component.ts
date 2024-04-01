import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { UserService } from '../user.service';
import { Cas, Korisnik, Predmet } from '../models';

@Component({
  selector: 'app-pocetna',
  templateUrl: './pocetna.component.html',
  styleUrls: ['./pocetna.component.css']
})
export class PocetnaComponent {
  constructor(private servis: UserService,
    private router: Router){}

  username: string = ""
  password: string = ""
  type: string = ""
  msg: string = ""
  brUcenika: number = 0;
  actNastavnici: Korisnik[] = []
  originalNastavnici: Korisnik[] = [];
  allPredmeti: Predmet[] = [];
  brNastavnika: number = 0;
  casovi7dana: number = 0;
  casovimesecdana: number = 0;
  svicasovi: Cas[] = []
  svipredmeti: Predmet[] =[]

  searchParamIme: string = '';
  searchParamPrezime: string = '';
  searchParamPredmeti: string = '';
  sortOption: string = 'ime';
  sortOrder: string = 'asc';

  teachersList: { name: string, surname: string, subject: string }[] = [];
  filteredTeachersList: { name: string, surname: string, subject: string }[] = [];


  ngOnInit(): void {
    this.servis.getBrUcenika().subscribe(data=>{
      this.brUcenika = data.num;
      this.servis.getNastavnici().subscribe(data=>{
        this.actNastavnici = data
        this.actNastavnici.forEach(nastavnik => {
          nastavnik.predmeti.sort();  //nastavnik.predmeti.sort((a, b) => b.localeCompare(a)); // Sort nerastuce
        });
        this.originalNastavnici = [...this.actNastavnici]; // Copy
        this.brNastavnika = this.actNastavnici.length
        this.servis.getCasovi(new Date()).subscribe(data => {
          this.casovimesecdana = data.length;

          const sevenDaysAgo = new Date();
          sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
          this.casovi7dana = data.filter(cas => new Date(cas.vremeod) > sevenDaysAgo).length;
          this.fillPredmet()
        }
      )
    })
  })
  }

  login(){
    if(this.username=="" || this.password=="" || this.type==""){
      this.msg="NISU UNET SVI PODACI"
      return;
    }
    this.servis.login(this.username, this.password).subscribe(
      data=>{
        if(data==null){
          this.msg="NEMA KORISNIKA"
          return;
        }
        else {
          if(this.type != data.tip){
            this.msg = "POGRESAN TIP"
            return;
          }
          this.msg = ""
          localStorage.setItem("logged", JSON.stringify(data))
          this.router.navigate([this.type])
        }
      }, error=>{
        this.msg = error.error.error
      }
    )
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
}
